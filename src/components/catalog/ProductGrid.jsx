import React from 'react';
import { ProductCard } from './ProductCard';
import { ShoppingBag, Search, RotateCcw } from 'lucide-react';

export const ProductGrid = ({ 
  products, 
  onSelectProduct, 
  onQuickShare, 
  onResetFilters,
  searchQuery = '',
  onClearSearch
}) => {
  if (products.length === 0) {
    const isSearchEmpty = Boolean(searchQuery && searchQuery.trim());

    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-10 sm:p-12 text-center max-w-lg mx-auto my-8 sm:my-12 shadow-sm space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
          {isSearchEmpty ? (
            <Search className="w-8 h-8 text-gray-400 stroke-[1.8]" />
          ) : (
            <ShoppingBag className="w-8 h-8 text-gray-400 stroke-[1.8]" />
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-xl text-brand-dark">
            {isSearchEmpty 
              ? 'No encontramos productos con esa búsqueda.' 
              : 'No encontramos prendas con estos filtros'}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {isSearchEmpty 
              ? 'Prueba con otro nombre o categoría.' 
              : 'Prueba cambiando la categoría seleccionada o restablece los filtros para ver todo el catálogo disponible.'}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (onClearSearch) onClearSearch();
              if (onResetFilters) onResetFilters();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-smooth shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSearchEmpty ? 'Limpiar Búsqueda' : 'Restablecer Filtros'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
          onQuickShare={onQuickShare}
        />
      ))}
    </div>
  );
};
