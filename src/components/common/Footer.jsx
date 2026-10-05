import React from 'react';
import { MessageCircle, Phone, MapPin, Shield } from 'lucide-react';
import { WHATSAPP_PHONE_DISPLAY, getGeneralWhatsAppUrl } from '../../services/whatsappService';

export const Footer = ({ 
  setActiveView, 
  setCatalogAudienceFilter,
  setSelectedCategory,
  setSearchQuery 
}) => {
  const whatsappUrl = getGeneralWhatsAppUrl();

  const handleAudienceClick = (audience) => {
    setActiveView('home');
    if (setCatalogAudienceFilter) {
      setCatalogAudienceFilter(audience);
    }
    if (setSelectedCategory) {
      setSelectedCategory('todos');
    }
    if (setSearchQuery) {
      setSearchQuery('');
    }
    const elem = document.getElementById('catalogo-seccion');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-dark text-white border-t border-gray-800 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-champagne/40 bg-white">
                <img
                  src="/logo-temp.jpeg"
                  alt="Logo DULCE chic y sneaks"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                DULCE
                <span className="text-xs font-normal ml-2 px-2 py-0.5 rounded-full bg-brand-champagne/20 text-brand-champagne uppercase font-sans">
                  chic & sneaks
                </span>
              </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu tienda favorita de moda chic, ropa en tendencia y los sneakers más buscados para hombre y mujer. Atención 100% personalizada.
            </p>
          </div>

          {/* Colecciones */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold uppercase tracking-wider text-white">
              Colecciones
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => handleAudienceClick('hombre')}
                  className="hover:text-brand-champagne transition-colors flex items-center gap-2"
                >
                  <span>👔 Catálogo de Hombre</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAudienceClick('mujer')}
                  className="hover:text-brand-champagne transition-colors flex items-center gap-2"
                >
                  <span>👗 Catálogo de Mujer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAudienceClick('todos')}
                  className="hover:text-brand-champagne transition-colors flex items-center gap-2"
                >
                  <span>🛍️ Ver Catálogo Completo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto & Pedidos */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold uppercase tracking-wider text-white">
              Atención & Pedidos
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-gray-300 font-medium">Línea de WhatsApp:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    {WHATSAPP_PHONE_DISPLAY}
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-champagne shrink-0" />
                <span>Envíos a todo el país</span>
              </li>
            </ul>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-whatsapp hover:bg-brand-whatsappDark text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-smooth shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              Chatear ahora
            </a>
          </div>

          {/* Redes Sociales (Espacios preparados) */}
          <div className="space-y-4">
            <h4 className="font-display text-base font-semibold uppercase tracking-wider text-white">
              Síguenos en Redes
            </h4>
            <p className="text-xs text-gray-400">
              Descubre nuevos lanzamientos, outfits de inspiración y promociones exclusivas.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 shadow-sm"
                title="Instagram (Próximamente enlace oficial)"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-black hover:border hover:border-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 shadow-sm"
                title="TikTok (Próximamente enlace oficial)"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 3.92.95V6.69z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 shadow-sm font-bold text-sm"
                title="Facebook (Próximamente enlace oficial)"
              >
                f
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DULCE chic y sneaks. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acceso Administrador</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
