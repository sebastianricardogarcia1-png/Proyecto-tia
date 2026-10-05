import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../../services/whatsappService';

export const WhatsAppFloatingButton = () => {
  const whatsappUrl = getGeneralWhatsAppUrl();

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 left-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-brand-whatsapp hover:bg-brand-whatsappDark text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        title="Contactar a DULCE chic y sneaks por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 stroke-[2.2]" />
        
        {/* Ring animation */}
        <span className="absolute -inset-1 rounded-full bg-brand-whatsapp/40 animate-ping -z-10 opacity-75"></span>

        {/* Tooltip visible on hover */}
        <span className="hidden md:group-hover:flex absolute left-16 bg-brand-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          ¿Tienes dudas? Escríbenos
        </span>
      </a>
    </aside>
  );
};
