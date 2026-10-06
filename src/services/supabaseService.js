import { supabase } from './supabaseClient';

/**
 * Transforma un registro de producto y sus variantes de Supabase (snake_case)
 * al modelo exacto de datos que utiliza la aplicación en React (camelCase).
 */
export const transformProductFromSupabase = (dbProduct) => {
  if (!dbProduct) return null;

  const rawVariants = Array.isArray(dbProduct.variantes) ? dbProduct.variantes : [];

  // Ordenar variantes por la columna orden o por fecha
  const sortedVariants = [...rawVariants].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  const formattedVariants = sortedVariants.map((v) => ({
    id: v.id,
    productId: v.producto_id,
    color: v.color || 'Estilo Principal',
    price: Number(v.precio || 0),
    imageUrl: v.imagen_url || '',
    available: v.disponible !== undefined ? Boolean(v.disponible) : true,
    reference: v.referencia || '',
    description: v.descripcion || '',
    order: v.orden ?? 0,
    createdAt: v.created_at
  }));

  // Fallback en caso de que un producto no tenga variantes asociadas
  const variants = formattedVariants.length > 0 ? formattedVariants : [
    {
      id: `var-${dbProduct.id}-0`,
      productId: dbProduct.id,
      color: 'Estilo Principal',
      price: 0,
      imageUrl: '',
      available: true,
      reference: dbProduct.referencia || '',
      description: '',
      order: 0,
      createdAt: dbProduct.created_at
    }
  ];

  const mainVariant = variants[0];
  const isAnyAvailable = variants.some((v) => v.available);

  return {
    id: dbProduct.id,
    name: dbProduct.nombre || '',
    audience: dbProduct.publico || 'mujer',
    category: dbProduct.categoria || 'zapatos',
    description: dbProduct.descripcion || '',
    isNew: Boolean(dbProduct.es_nuevo),
    isFeatured: Boolean(dbProduct.es_destacado),
    active: dbProduct.activo !== undefined ? Boolean(dbProduct.activo) : true,
    reference: dbProduct.referencia || mainVariant?.reference || '',
    price: mainVariant?.price !== undefined ? Number(mainVariant.price) : 0,
    imageUrl: mainVariant?.imageUrl || '',
    available: isAnyAvailable,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    variants
  };
};

/**
 * Obtiene todos los productos de Supabase junto con sus variantes relacionadas.
 */
export const fetchProductsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id,
        nombre,
        publico,
        categoria,
        descripcion,
        es_nuevo,
        es_destacado,
        activo,
        referencia,
        created_at,
        updated_at,
        variantes (
          id,
          producto_id,
          color,
          precio,
          imagen_url,
          disponible,
          referencia,
          descripcion,
          orden,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar productos en Supabase:', error);
      return { success: false, data: [], error };
    }

    const transformedProducts = (data || []).map(transformProductFromSupabase);
    return { success: true, data: transformedProducts, error: null };
  } catch (err) {
    console.error('Error inesperado al conectar con Supabase:', err);
    return { success: false, data: [], error: err };
  }
};

/**
 * Sube una imagen (Blob, File o Data URL base64) al bucket 'productos' de Supabase Storage.
 * Retorna la URL pública del archivo subido.
 * @param {string|Blob|File} imageSource - Data URL (base64) o Blob/File
 * @param {string} [fileNamePrefix] - Prefijo descriptivo para el archivo
 * @returns {Promise<{ success: boolean, publicUrl: string|null, error: any }>}
 */
export const uploadProductImageToStorage = async (imageSource, fileNamePrefix = 'producto') => {
  try {
    if (!imageSource) {
      return { success: false, publicUrl: null, error: new Error('No se proporcionó ninguna imagen') };
    }

    // Si ya es una URL HTTP/HTTPS externa o de Supabase, no volver a subirla
    if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      return { success: true, publicUrl: imageSource, error: null };
    }

    let fileBody;
    let extension = 'webp';
    let contentType = 'image/webp';

    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      const match = imageSource.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
      if (match) {
        contentType = match[1];
        extension = contentType.split('/')[1] || 'webp';
        if (extension === 'jpeg') extension = 'jpg';
      }
      const res = await fetch(imageSource);
      fileBody = await res.blob();
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      fileBody = imageSource;
      contentType = imageSource.type || 'image/webp';
      extension = contentType.split('/')[1] || 'webp';
      if (extension === 'jpeg') extension = 'jpg';
    } else {
      return { success: false, publicUrl: null, error: new Error('Formato de imagen no soportado') };
    }

    // Generar un nombre de archivo único
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const cleanPrefix = fileNamePrefix
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 35);

    const filePath = `${cleanPrefix}-${timestamp}-${randomSuffix}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(filePath, fileBody, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error al subir imagen a Supabase Storage:', uploadError);
      return { success: false, publicUrl: null, error: uploadError };
    }

    const { data: publicUrlData } = supabase.storage
      .from('productos')
      .getPublicUrl(uploadData.path);

    return { success: true, publicUrl: publicUrlData.publicUrl, error: null };
  } catch (err) {
    console.error('Error inesperado al subir imagen a Storage:', err);
    return { success: false, publicUrl: null, error: err };
  }
};

/**
 * Crea un producto nuevo en Supabase junto con todas sus variantes.
 * Procesa automáticamente la subida de imágenes a Supabase Storage.
 * @param {Object} productData - Datos estructurados del producto
 * @returns {Promise<{ success: boolean, data: Object|null, error: any }>}
 */
export const createProductInSupabase = async (productData) => {
  try {
    const rawVariants = Array.isArray(productData.variants) && productData.variants.length > 0
      ? productData.variants
      : [
          {
            color: 'Estilo Principal',
            price: productData.price || 0,
            imageUrl: productData.imageUrl || '',
            available: productData.available !== undefined ? Boolean(productData.available) : true,
            reference: productData.reference || '',
            description: productData.description || ''
          }
        ];

    // 1. Procesar variantes y subir imágenes a Storage si vienen en Base64
    const processedVariants = [];

    for (let i = 0; i < rawVariants.length; i++) {
      const v = rawVariants[i];
      let finalImageUrl = v.imageUrl || '';

      if (typeof finalImageUrl === 'string' && finalImageUrl.startsWith('data:')) {
        const uploadResult = await uploadProductImageToStorage(
          finalImageUrl,
          `${productData.name || 'producto'}-${v.color || i + 1}`
        );

        if (uploadResult.success && uploadResult.publicUrl) {
          finalImageUrl = uploadResult.publicUrl;
        } else {
          console.error(`Fallo al subir imagen para la variante ${v.color}:`, uploadResult.error);
          return {
            success: false,
            data: null,
            error: uploadResult.error || new Error(`No se pudo subir la fotografía del estilo ${v.color}`)
          };
        }
      }

      processedVariants.push({
        color: (v.color || 'Estilo Principal').trim(),
        precio: Number(v.price || 0),
        imagen_url: finalImageUrl,
        disponible: v.available !== undefined ? Boolean(v.available) : true,
        referencia: (v.reference || '').trim(),
        descripcion: (v.description || '').trim(),
        orden: i
      });
    }

    // 2. Insertar el registro principal en la tabla 'productos'
    const productPayload = {
      nombre: (productData.name || '').trim(),
      publico: productData.audience || 'mujer',
      categoria: (productData.category || 'zapatos').toLowerCase().trim(),
      descripcion: (productData.description || '').trim(),
      es_nuevo: Boolean(productData.isNew),
      es_destacado: Boolean(productData.isFeatured),
      activo: productData.active !== undefined ? Boolean(productData.active) : true,
      referencia: (productData.reference || '').trim()
    };

    const { data: createdProduct, error: productError } = await supabase
      .from('productos')
      .insert([productPayload])
      .select()
      .single();

    if (productError) {
      console.error('Error al insertar producto en tabla productos:', productError);
      return { success: false, data: null, error: productError };
    }

    // 3. Insertar las variantes asociándolas al UUID generado (createdProduct.id)
    const variantsPayload = processedVariants.map((v) => ({
      ...v,
      producto_id: createdProduct.id
    }));

    const { data: createdVariants, error: variantsError } = await supabase
      .from('variantes')
      .insert(variantsPayload)
      .select();

    if (variantsError) {
      console.error('Error al insertar variantes en tabla variantes:', variantsError);
      return { success: false, data: null, error: variantsError };
    }

    // 4. Retornar el producto completo adaptado a React
    const completeDbProduct = {
      ...createdProduct,
      variantes: createdVariants
    };

    const transformed = transformProductFromSupabase(completeDbProduct);
    return { success: true, data: transformed, error: null };
  } catch (err) {
    console.error('Error inesperado en createProductInSupabase:', err);
    return { success: false, data: null, error: err };
  }
};

