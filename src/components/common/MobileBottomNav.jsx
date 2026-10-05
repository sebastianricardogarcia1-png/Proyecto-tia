import React from 'react';
import { Home, User, Users, Sparkles, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../../services/whatsappService';

export const MobileBottomNav = ({
  activeView,
  setActiveView,
  audienceFilter,
  setAudienceFilter,
  selectedCategory = 'todos',
  setSelectedCategory
}) => {
  const whatsappUrl = getGeneralWhatsAppUrl();

  const handleNav = (view, audience = 'todos', category = 'todos') => {
    setActiveView(view);
    if (setAudienceFilter) {
      setAudienceFilter(audience);
    }
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    
    if (view === 'home' && audience === 'todos' && category === 'todos') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'home') {
      const catalogElem = document.getElementById('catalogo-seccion');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHomeActive = activeView === 'home' && audienceFilter === 'todos' && selectedCategory === 'todos';
  const isHombreActive = activeView === 'home' && audienceFilter === 'hombre';
  const isMujerActive = activeView === 'home' && audienceFilter === 'mujer';
  const isNewActive = activeView === 'new';

  return (
    <nav 
      aria-label="Navegación principal móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* 1. Inicio */}
        <button
          onClick={() => handleNav('home', 'todos')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isHomeActive ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-1 rounded-full transition-transform ${isHomeActive ? 'bg-gray-100 scale-110' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Inicio</span>
        </button>

        {/* 2. Hombre */}
        <button
          onClick={() => handleNav('home', 'hombre')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isHombreActive ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-1 rounded-full transition-transform ${isHombreActive ? 'bg-blue-50 scale-110' : ''}`}>
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Hombre</span>
        </button>

        {/* 3. Mujer */}
        <button
          onClick={() => handleNav('home', 'mujer')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isMujerActive ? 'text-pink-600 font-bold' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-1 rounded-full transition-transform ${isMujerActive ? 'bg-pink-50 scale-110' : ''}`}>
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Mujer</span>
        </button>

        {/* 4. Recién Llegados */}
        <button
          onClick={() => handleNav('new')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isNewActive ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-1 rounded-full transition-transform ${isNewActive ? 'bg-gray-100 scale-110' : ''}`}>
            <Sparkles className="w-5 h-5 stroke-[2.2] text-brand-gold" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Nuevos</span>
        </button>

        {/* 5. WhatsApp Directo */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-emerald-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shadow-xs">
            <MessageCircle className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5 text-emerald-700">Chat</span>
        </a>

      </div>
    </nav>
  );
};
