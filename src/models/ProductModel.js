/**
 * Modelo de datos canónico para Producto y Variante en DULCE chic & sneaks.
 * 
 * En el patrón MVC en el frontend:
 * - Model: Define la estructura, reglas de consistencia de datos y normalización de la entidad.
 * - Controller / Context: Coordina el flujo de datos y las operaciones de la tienda.
 * - View: Renderiza la interfaz en componentes React.
 */

/**
 * Normaliza un objeto variante asegurando tipos consistentes y valores por defecto.
 * 
 * @param {Object} v - Datos de la variante
 * @param {number|string} indexOrId - Índice o ID
 * @returns {Object} Variante normalizada
 */
export const normalizeVariant = (v = {}, indexOrId = 0) => {
  const { sizes, ...rest } = v;
  return {
    ...rest,
    id: v.id !== undefined && v.id !== null ? v.id : `var-${Date.now()}-${indexOrId}`,
    color: (v.color || 'Estilo Principal').trim(),
    price: Number(v.price || 0),
    imageUrl: v.imageUrl || '',
    available: v.available !== undefined ? Boolean(v.available) : true,
    reference: (v.reference || '').trim() || '',
    order: v.order !== undefined ? Number(v.order) : 0,
  };
};

/**
 * Normaliza un producto asegurando sincronización de variantes, precio principal,
 * imagen destacada y disponibilidad global.
 * 
 * Regla de oro de la tienda:
 * El producto general está disponible SI Y SOLO SI al menos una variante está disponible.
 * 
 * @param {Object} p - Producto crudo recibido desde el servicio
 * @returns {Object} Producto normalizado
 */
export const normalizeProduct = (p = {}) => {
  const rawVariants = (p.variants && Array.isArray(p.variants) && p.variants.length > 0)
    ? p.variants
    : [
        {
          id: `var-${p.id || Date.now()}-0`,
          color: 'Estilo Principal',
          price: p.price || 0,
          imageUrl: p.imageUrl || '',
          available: p.available !== undefined ? Boolean(p.available) : true,
          reference: p.reference || '',
          order: 0,
        }
      ];

  const formattedVariants = rawVariants.map((v, idx) => normalizeVariant(v, idx));
  const isAnyAvailable = formattedVariants.some((v) => v.available);
  const mainVariant = formattedVariants[0];

  return {
    ...p,
    id: p.id,
    name: (p.name || '').trim(),
    audience: p.audience || 'mujer',
    category: (p.category || 'zapatos').toLowerCase(),
    description: (p.description || '').trim(),
    isNew: Boolean(p.isNew),
    isFeatured: Boolean(p.isFeatured),
    active: p.active !== undefined ? Boolean(p.active) : true,
    reference: p.reference || mainVariant?.reference || '',
    price: mainVariant?.price !== undefined ? Number(mainVariant.price) : Number(p.price || 0),
    imageUrl: mainVariant?.imageUrl || p.imageUrl || '',
    available: isAnyAvailable,
    variants: formattedVariants,
  };
};
