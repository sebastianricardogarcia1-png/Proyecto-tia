/**
 * Categorías oficiales de DULCE chic y sneaks
 */

export const CATEGORIES_HOMBRE = [
  { id: 'camisas', name: 'Camisas', slug: 'camisas-hombre' },
  { id: 'zapatos', name: 'Zapatos / Sneaks', slug: 'zapatos-hombre' },
  { id: 'bolsos', name: 'Bolsos & Morrales', slug: 'bolsos-hombre' },
  { id: 'gorras', name: 'Gorras', slug: 'gorras-hombre' },
  { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos-hombre' },
  { id: 'pantalonetas', name: 'Pantalonetas', slug: 'pantalonetas-hombre' },
  { id: 'jeans', name: 'Jeans', slug: 'jeans-hombre' },
];

export const CATEGORIES_MUJER = [
  { id: 'camisas', name: 'Camisas & Tops', slug: 'camisas-mujer' },
  { id: 'zapatos', name: 'Zapatos / Sneaks', slug: 'zapatos-mujer' },
  { id: 'bolsos', name: 'Bolsos & Carteras', slug: 'bolsos-mujer' },
  { id: 'gorras', name: 'Gorras', slug: 'gorras-mujer' },
  { id: 'conjuntos', name: 'Conjuntos', slug: 'conjuntos-mujer' },
  { id: 'faldas', name: 'Faldas & Vestidos', slug: 'faldas-mujer' },
  { id: 'jeans', name: 'Jeans', slug: 'jeans-mujer' },
  { id: 'pijamas', name: 'Pijamas', slug: 'pijamas-mujer' },
];

export const getCategoriesByAudience = (audience) => {
  if (audience === 'hombre') return CATEGORIES_HOMBRE;
  if (audience === 'mujer') return CATEGORIES_MUJER;
  
  // Para 'todos', unir categorías únicas
  const allMap = new Map();
  [...CATEGORIES_HOMBRE, ...CATEGORIES_MUJER].forEach(cat => {
    if (!allMap.has(cat.id)) {
      allMap.set(cat.id, cat);
    }
  });
  return Array.from(allMap.values());
};
