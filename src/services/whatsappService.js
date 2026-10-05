/**
 * Servicio de integración con WhatsApp para DULCE chic & sneaks
 * Número oficial: +57 301 382 8427
 */

export const WHATSAPP_PHONE = "573013828427";
export const WHATSAPP_PHONE_DISPLAY = "+57 301 382 8427";

/**
 * Formatea un número en formato moneda colombiana COP ($ XX.XXX)
 */
export const formatCOP = (amount) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Genera el enlace de WhatsApp para consultar por un producto específico (o una variante/estilo)
 */
export const getProductWhatsAppUrl = (product, variant = null) => {
  const activeVariant =
    variant ||
    (product.variants && product.variants.length > 0
      ? product.variants[0]
      : null);
  const price =
    activeVariant?.price !== undefined ? activeVariant.price : product.price;
  const formattedPrice = formatCOP(price);
  const color = activeVariant?.color || "Estilo Principal";

  const message = `¡Hola!

Vi este producto en la tienda virtual de *DULCE chic & sneaks* y me interesa:

*Producto:* ${product.name}
*Estilo/Color:* ${color}
*Precio:* ${formattedPrice}

¿Sigue disponible? ¿Qué detalles me puedes compartir?

¡Muchas gracias!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

/**
 * Genera el enlace de WhatsApp para atención o consulta general
 */
export const getGeneralWhatsAppUrl = () => {
  const message = `¡Hola!\n\nVengo desde la tienda virtual de *DULCE chic & sneaks* y quisiera hacer una consulta. ¿Me podrían brindar más información por favor?\n\n¡Muchas gracias!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};
