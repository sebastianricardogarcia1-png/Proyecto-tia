/**
 * Servicio para consultar productos desde la API REST de Laravel.
 * Utiliza la variable de entorno VITE_API_URL con fallback a http://127.0.0.1:8000/api.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Consulta la lista pública de productos activos desde Laravel.
 * Retorna el mismo contrato de datos { success, data, error } que espera React.
 */
export const fetchProductsFromLaravel = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en servidor Laravel: HTTP ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: Array.isArray(result.data) ? result.data : [],
      error: null,
    };
  } catch (err) {
    console.warn('No fue posible obtener productos desde Laravel API:', err.message);
    return {
      success: false,
      data: [],
      error: err,
    };
  }
};

/**
 * Consulta el detalle de un producto específico desde Laravel por ID.
 */
export const fetchProductByIdFromLaravel = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${productId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || null,
      error: null,
    };
  } catch (err) {
    console.warn(`No fue posible obtener el producto ${productId} desde Laravel:`, err.message);
    return {
      success: false,
      data: null,
      error: err,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Gestión de Autenticación con Laravel Sanctum
|--------------------------------------------------------------------------
*/
const TOKEN_KEY = 'dulce_chic_admin_token';

/**
 * Obtener el token de acceso guardado en localStorage.
 */
export const getAdminToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Guardar el token de acceso en localStorage.
 */
export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Eliminar el token de acceso de localStorage.
 */
export const removeAdminToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Iniciar sesión como administrador en Laravel Sanctum.
 */
export const loginAdminInLaravel = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error al iniciar sesión.',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (err) {
    console.error('Error al conectar con Laravel login:', err);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor de autenticación de Laravel.',
    };
  }
};

/**
 * Cerrar sesión en Laravel Sanctum y revocar el token actual.
 */
export const logoutAdminInLaravel = async (token) => {
  try {
    const activeToken = token || getAdminToken();
    if (!activeToken) return { success: true };

    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${activeToken}`,
      },
    });

    return { success: response.ok };
  } catch (err) {
    console.warn('Error al revocar token en Laravel:', err);
    return { success: false, error: err };
  }
};

/**
 * Verificar si el token actual es válido consultando el endpoint /api/me.
 */
export const checkAuthInLaravel = async (token) => {
  try {
    const activeToken = token || getAdminToken();
    if (!activeToken) return { success: false };

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${activeToken}`,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false };
  }
};

/*
|--------------------------------------------------------------------------
| Subida de Imágenes y CRUD Administrativo en Laravel
|--------------------------------------------------------------------------
*/

/**
 * Sube una imagen (Base64 o File/Blob) a Laravel storage/app/public/productos.
 * Si ya es una URL completa (http/https), la devuelve tal cual.
 */
export const uploadProductImageToLaravel = async (imageSource, token) => {
  try {
    if (!imageSource) {
      return { success: false, publicUrl: '', error: 'No se proporcionó imagen' };
    }

    // Si ya es una URL HTTP/HTTPS externa o de almacenamiento, no volver a subirla
    if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      return { success: true, publicUrl: imageSource };
    }

    const activeToken = token || getAdminToken();
    if (!activeToken) {
      return { success: false, error: 'No hay sesión de administrador activa para subir la imagen.' };
    }

    let response;

    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      // Subida de imagen comprimida en Base64
      response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ image: imageSource }),
      });
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      // Subida de archivo binario (multipart)
      const formData = new FormData();
      formData.append('image', imageSource);

      response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: formData,
      });
    } else {
      return { success: false, error: 'Formato de imagen no soportado.' };
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Error al subir la imagen.');
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      publicUrl: data.url,
      path: data.path,
    };
  } catch (err) {
    console.error('Error al subir imagen a Laravel:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Procesa las variantes subiendo cualquier imagen nueva en Base64 al backend de Laravel.
 */
const processVariantsImages = async (variants, token) => {
  const processed = [];

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    let finalImageUrl = v.imageUrl || '';

    // Si la imagen es una foto recién seleccionada (data URL en Base64)
    if (typeof finalImageUrl === 'string' && finalImageUrl.startsWith('data:')) {
      const uploadResult = await uploadProductImageToLaravel(finalImageUrl, token);
      if (uploadResult.success && uploadResult.publicUrl) {
        finalImageUrl = uploadResult.publicUrl;
      } else {
        throw new Error(uploadResult.error || `No se pudo subir la fotografía de la variante "${v.color || i + 1}".`);
      }
    }

    // Normalizar ID de variante: si es un ID temporal de cliente ("var-..."), enviar null
    const variantId = (typeof v.id === 'number' || (typeof v.id === 'string' && /^\d+$/.test(v.id)))
      ? Number(v.id)
      : null;

    processed.push({
      id: variantId,
      color: (v.color || 'Estilo Principal').trim(),
      price: Number(v.price || 0),
      imageUrl: finalImageUrl,
      available: v.available !== undefined ? Boolean(v.available) : true,
      reference: (v.reference || '').trim() || null,
      order: v.order !== undefined ? Number(v.order) : i,
    });
  }

  return processed;
};

/**
 * Crea un producto y sus variantes en Laravel + MySQL.
 */
export const createProductInLaravel = async (productData, token) => {
  try {
    const activeToken = token || getAdminToken();
    if (!activeToken) {
      return { success: false, error: 'Se requiere sesión de administrador activa.' };
    }

    const rawVariants = Array.isArray(productData.variants) && productData.variants.length > 0
      ? productData.variants
      : [
          {
            color: 'Estilo Principal',
            price: productData.price || 0,
            imageUrl: productData.imageUrl || '',
            available: productData.available !== undefined ? Boolean(productData.available) : true,
            reference: productData.reference || '',
          }
        ];

    // 1. Subir a Laravel las fotos de las variantes que vengan en Base64
    const processedVariants = await processVariantsImages(rawVariants, activeToken);

    // 2. Preparar el payload del producto en formato compatible
    const payload = {
      name: (productData.name || '').trim(),
      audience: productData.audience || 'mujer',
      category: (productData.category || 'zapatos').toLowerCase().trim(),
      description: (productData.description || '').trim() || null,
      isNew: Boolean(productData.isNew),
      isFeatured: Boolean(productData.isFeatured),
      active: productData.active !== undefined ? Boolean(productData.active) : true,
      reference: (productData.reference || '').trim() || null,
      variants: processedVariants,
    };

    // 3. Enviar a POST /api/productos con token Bearer
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Error al crear producto.');
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (err) {
    console.error('Error al crear producto en Laravel:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Actualiza un producto y sincroniza sus variantes en Laravel + MySQL.
 */
export const updateProductInLaravel = async (productId, productData, token) => {
  try {
    const activeToken = token || getAdminToken();
    if (!activeToken) {
      return { success: false, error: 'Se requiere sesión de administrador activa.' };
    }

    let payload = {};

    if (productData.name !== undefined) payload.name = (productData.name || '').trim();
    if (productData.audience !== undefined) payload.audience = productData.audience;
    if (productData.category !== undefined) payload.category = (productData.category || '').toLowerCase().trim();
    if (productData.description !== undefined) payload.description = (productData.description || '').trim() || null;
    if (productData.isNew !== undefined) payload.isNew = Boolean(productData.isNew);
    if (productData.isFeatured !== undefined) payload.isFeatured = Boolean(productData.isFeatured);
    if (productData.active !== undefined) payload.active = Boolean(productData.active);
    if (productData.reference !== undefined) payload.reference = (productData.reference || '').trim() || null;

    if (Array.isArray(productData.variants)) {
      payload.variants = await processVariantsImages(productData.variants, activeToken);
    }

    const response = await fetch(`${API_BASE_URL}/productos/${productId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Error al actualizar producto.');
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (err) {
    console.error('Error al actualizar producto en Laravel:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Elimina un producto en Laravel + MySQL (eliminación de variantes en cascada).
 */
export const deleteProductInLaravel = async (productId, token) => {
  try {
    const activeToken = token || getAdminToken();
    if (!activeToken) {
      return { success: false, error: 'Se requiere sesión de administrador activa.' };
    }

    const response = await fetch(`${API_BASE_URL}/productos/${productId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${activeToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Error al eliminar producto.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Error al eliminar producto en Laravel:', err);
    return { success: false, error: err.message };
  }
};
