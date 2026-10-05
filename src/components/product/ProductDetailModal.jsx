import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Share2, Check, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP, getProductWhatsAppUrl } from '../../services/whatsappService';
import { Badge } from '../common/Badge';
import { useProducts } from '../../context/ProductContext';

export const ProductDetailModal = ({ product, onClose }) => {
  const { showToast } = useProducts();
  const [copied, setCopied] = useState(false);

  // Asegurar variantes
  const variants = product?.variants && Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : [
        {
          id: `var-${product?.id}`,
          color: 'Estilo Principal',
          price: product?.price,
          imageUrl: product?.imageUrl,
          available: product?.available !== undefined ? product?.available : true,
          reference: product?.reference || '',
          description: product?.description || ''
        }
      ];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() => {
    if (product?.initialVariantIndex !== undefined && product.initialVariantIndex < variants.length) {
      return product.initialVariantIndex;
    }
    return 0;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setSelectedVariantIndex((prev) => (prev - 1 + variants.length) % variants.length);
      }
      if (e.key === 'ArrowRight') {
        setSelectedVariantIndex((prev) => (prev + 1) % variants.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, variants.length]);

  if (!product) return null;

  const hasMultipleVariants = variants.length > 1;
  const activeVariant = variants[selectedVariantIndex] || variants[0];
  const isAvailable = activeVariant.available !== undefined ? activeVariant.available : product.available;
  const currentPrice = activeVariant.price !== undefined ? activeVariant.price : product.price;
  const currentReference = activeVariant.reference || product.reference;
  const currentDescription = activeVariant.description || product.description;

  const whatsappUrl = getProductWhatsAppUrl(product, activeVariant);

  const handlePrevVariant = (e) => {
    e.stopPropagation();
    setSelectedVariantIndex((prev) => (prev - 1 + variants.length) % variants.length);
  };

  const handleNextVariant = (e) => {
    e.stopPropagation();
    setSelectedVariantIndex((prev) => (prev + 1) % variants.length);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${product.name} (${activeVariant.color}) | DULCE chic y sneaks`,
      text: `Mira esta prenda en DULCE chic y sneaks: ${product.name} - ${activeVariant.color} por ${formatCOP(currentPrice)}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('¡Enlace compartido!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast('¡Enlace copiado al portapapeles!');
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (e) {}
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[88vh] sm:max-h-[90vh] my-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-gray-100"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image with Variant Navigation */}
        <div className="relative md:w-1/2 bg-[#F5F5F7] flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-full select-none">
          <img
            key={activeVariant.imageUrl || activeVariant.id}
            src={activeVariant.imageUrl || product.imageUrl}
            alt={`${product.name} - ${activeVariant.color}`}
            className="w-full h-full object-cover object-center max-h-[420px] md:max-h-full animate-fade-in"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
            {!isAvailable && (
              <Badge variant="outOfStock" size="sm">
                🔴 Agotado
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="new" size="sm">
                🆕 Nuevo
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="featured" size="sm">
                ⭐ Destacado
              </Badge>
            )}
          </div>

          {/* Navigation Arrows for Modal */}
          {hasMultipleVariants && (
            <>
              <button
                onClick={handlePrevVariant}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Estilo anterior"
                title="Estilo anterior (Flecha izquierda)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextVariant}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Siguiente estilo"
                title="Siguiente estilo (Flecha derecha)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicator at bottom */}
              <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
                {variants.map((v, idx) => (
                  <span
                    key={v.id || idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx === selectedVariantIndex
                        ? 'w-5 h-2 bg-white shadow-md'
                        : 'w-2 h-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Info, Variants Selector & Actions */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className={product.audience === 'hombre' ? 'text-blue-600' : 'text-pink-600'}>
                  {product.audience === 'hombre' ? '👔 Hombre' : '👗 Mujer'}
                </span>
                <span>•</span>
                <span>{product.category}</span>
              </span>
              {currentReference && <span className="font-mono text-gray-500">{currentReference}</span>}
            </div>

            {/* Product Title */}
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-dark leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Multiple Style / Color Selector Chips */}
            {hasMultipleVariants && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Estilos y Colores Disponibles ({variants.length})</span>
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {selectedVariantIndex + 1} de {variants.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => {
                    const isSelected = index === selectedVariantIndex;
                    return (
                      <button
                        key={variant.id || index}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-dark text-white border-brand-dark shadow-sm scale-[1.02]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-gold' : 'bg-gray-400'}`} />
                        <span>{variant.color}</span>
                        {!variant.available && (
                          <span className="text-[10px] text-rose-400 font-normal">(Agotado)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price & Availability Pill */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Precio {hasMultipleVariants && `(${activeVariant.color})`}
                </span>
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-brand-dark tracking-tight">
                  {formatCOP(currentPrice)}
                </span>
              </div>

              <div>
                <Badge variant={isAvailable ? 'available' : 'outOfStock'} size="sm">
                  {isAvailable ? '🟢 Disponible' : '🔴 Agotado'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Detalles
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                {currentDescription || 'Prenda con acabados de alta calidad. Para consultar detalles adicionales o disponibilidad, escríbenos directamente por WhatsApp.'}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-5 mt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2.5">
            
            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-brand-whatsapp hover:bg-brand-whatsappDark text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-white/20 stroke-[2.2]" />
              <span>
                {isAvailable
                  ? `Pedir ${hasMultipleVariants ? `(${activeVariant.color})` : 'por WhatsApp'}`
                  : `Consultar ${hasMultipleVariants ? `(${activeVariant.color})` : 'disponibilidad'}`}
              </span>
            </a>

            {/* Share / Copy button */}
            <button
              onClick={handleShare}
              className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0"
              title="Compartir o copiar enlace"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Compartir</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
