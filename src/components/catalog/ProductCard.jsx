import React, { useState } from 'react';
import { MessageCircle, Eye, Share2, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { formatCOP, getProductWhatsAppUrl } from '../../services/whatsappService';
import { Badge } from '../common/Badge';

export const ProductCard = ({ product, onSelectProduct, onQuickShare }) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  // Asegurar lista de variantes
  const variants = product.variants && Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : [
        {
          id: `var-${product.id}`,
          color: 'Estilo Principal',
          price: product.price,
          imageUrl: product.imageUrl,
          available: product.available !== undefined ? product.available : true,
          reference: product.reference || ''
        }
      ];

  const hasMultipleVariants = variants.length > 1;
  const activeVariant = variants[currentVariantIndex] || variants[0];
  const isAvailable = activeVariant.available !== undefined ? activeVariant.available : product.available;
  const currentPrice = activeVariant.price !== undefined ? activeVariant.price : product.price;
  const currentReference = activeVariant.reference || product.reference;

  const handlePrevVariant = (e) => {
    e.stopPropagation();
    setCurrentVariantIndex((prev) => (prev - 1 + variants.length) % variants.length);
  };

  const handleNextVariant = (e) => {
    e.stopPropagation();
    setCurrentVariantIndex((prev) => (prev + 1) % variants.length);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct({
        ...product,
        initialVariantIndex: currentVariantIndex
      });
    }
  };

  const whatsappUrl = getProductWhatsAppUrl(product, activeVariant);

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200/80 hover:border-brand-champagne shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Container */}
      <div 
        onClick={handleCardClick}
        className="relative w-full aspect-square bg-[#F5F5F7] overflow-hidden cursor-pointer select-none"
      >
        {/* Active Variant Image with Smooth Key Transition */}
        <img
          key={activeVariant.imageUrl || activeVariant.id}
          src={activeVariant.imageUrl || product.imageUrl}
          alt={`${product.name} - ${activeVariant.color}`}
          className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 animate-fade-in ${
            !isAvailable ? 'opacity-70 grayscale-[30%]' : ''
          }`}
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!isAvailable && (
            <Badge variant="outOfStock" size="xs">
              🔴 Agotado
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="new" size="xs">
              🆕 Nuevo
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="featured" size="xs">
              ⭐ Destacado
            </Badge>
          )}
        </div>

        {/* Top Right: Audience Pill & Variant Count */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-none">
          <Badge variant={product.audience === 'hombre' ? 'hombre' : 'mujer'} size="xs">
            {product.audience === 'hombre' ? 'Hombre' : 'Mujer'}
          </Badge>

          {hasMultipleVariants && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-tight shadow-sm">
              <Layers className="w-2.5 h-2.5 text-brand-gold" />
              <span>{variants.length} estilos</span>
            </span>
          )}
        </div>

        {/* Elegant Arrow Controls: Left / Right (Only if multi-variant) */}
        {hasMultipleVariants && (
          <>
            <button
              onClick={handlePrevVariant}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
              aria-label="Estilo anterior"
              title="Ver estilo anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextVariant}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
              aria-label="Siguiente estilo"
              title="Ver siguiente estilo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Micro Dots Indicators at the bottom of the image */}
            <div className="absolute bottom-2.5 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
              {variants.map((v, idx) => (
                <span
                  key={v.id || idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentVariantIndex
                      ? 'w-4 h-1.5 bg-white shadow-md'
                      : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Button on Hover (Hidden on mobile) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 p-4 pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md text-brand-dark text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Ver detalles
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Reference */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">
            <span>{product.category}</span>
            {currentReference && <span className="text-[10px] text-gray-400 font-mono">{currentReference}</span>}
          </div>

          {/* Product Name */}
          <h3 
            onClick={handleCardClick}
            className="font-display font-bold text-base text-brand-dark hover:text-brand-charcoal line-clamp-1 leading-snug cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Style / Color Indicator */}
          {hasMultipleVariants && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-500">Color / Estilo:</span>
              <span className="text-[11px] font-bold text-brand-dark bg-gray-100 px-2 py-0.5 rounded-lg truncate max-w-[170px]">
                {activeVariant.color}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-xl text-brand-dark tracking-tight">
              {formatCOP(currentPrice)}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-2">
          
          {/* Main Action: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-smooth flex items-center justify-center gap-1.5 shadow-xs ${
              isAvailable
                ? 'bg-brand-whatsapp hover:bg-brand-whatsappDark text-white shadow-emerald-500/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={isAvailable ? 'Pedir este estilo por WhatsApp' : 'Consultar disponibilidad por WhatsApp'}
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>{isAvailable ? 'Pedir por WhatsApp' : 'Consultar'}</span>
          </a>

          {/* Quick Share Button */}
          {onQuickShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickShare({
                  ...product,
                  name: hasMultipleVariants ? `${product.name} (${activeVariant.color})` : product.name,
                  price: currentPrice
                });
              }}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-smooth"
              title="Compartir o copiar enlace"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

    </article>
  );
};
