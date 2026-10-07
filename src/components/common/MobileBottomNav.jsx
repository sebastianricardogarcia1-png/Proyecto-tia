import React, { useState } from 'react';
import { Home, User, Users, Sparkles, Star, MessageCircle, X, ChevronRight } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../../services/whatsappService';
import { CATEGORIES_HOMBRE, CATEGORIES_MUJER } from '../../data/categories';

export const MobileBottomNav = ({
  activeView,
  setActiveView,
  audienceFilter,
  setAudienceFilter,
  selectedCategory = 'todos',
  setSelectedCategory
}) => {
  const [activeAudienceDrawer, setActiveAudienceDrawer] = useState(null); // null | 'hombre' | 'mujer'
  const whatsappUrl = getGeneralWhatsAppUrl();

  const handleNav = (view, audience = 'todos', category = 'todos') => {
    setActiveView(view);
    if (setAudienceFilter) {
      setAudienceFilter(audience);
    }
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    setActiveAudienceDrawer(null);
    
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

  const handleAudienceClick = (audience) => {
    // Si ya estamos viendo esta audiencia en el catálogo, abrir o alternar el menú de categorías
    if (activeAudienceDrawer === audience) {
      setActiveAudienceDrawer(null);
    } else {
      setActiveAudienceDrawer(audience);
    }
    
    // Navegar a Home con la audiencia seleccionada
    setActiveView('home');
    if (setAudienceFilter) {
      setAudienceFilter(audience);
    }
    const catalogElem = document.getElementById('catalogo-seccion');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (audience, categoryId) => {
    handleNav('home', audience, categoryId);
  };

  const isHomeActive = activeView === 'home' && audienceFilter === 'todos' && selectedCategory === 'todos';
  const isHombreActive = activeView === 'home' && audienceFilter === 'hombre';
  const isMujerActive = activeView === 'home' && audienceFilter === 'mujer';
  const isNewActive = activeView === 'new';
  const isFeaturedActive = activeView === 'featured';

  const currentCategories = activeAudienceDrawer === 'hombre' ? CATEGORIES_HOMBRE : CATEGORIES_MUJER;

  return (
    <>
      {/* Modal / Menú emergente de Categorías al tocar Hombre o Mujer */}
      {activeAudienceDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop con desenfoque suave */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveAudienceDrawer(null)}
          />

          {/* Sheet inferior */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl p-4 pb-6 z-10 max-h-[70vh] flex flex-col animate-slide-up border-t border-gray-100">
            {/* Header del drawer */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${activeAudienceDrawer === 'hombre' ? 'bg-blue-600' : 'bg-pink-600'}`} />
                <h3 className="font-display font-bold text-base text-gray-900">
                  Categorías {activeAudienceDrawer === 'hombre' ? 'Hombre' : 'Mujer'}
                </h3>
              </div>
              <button
                onClick={() => setActiveAudienceDrawer(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Cerrar categorías"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de categorías scrollable */}
            <div className="overflow-y-auto space-y-1.5 py-1">
              <button
                onClick={() => handleCategorySelect(activeAudienceDrawer, 'todos')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'todos'
                    ? (activeAudienceDrawer === 'hombre' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700')
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>Ver Todo {activeAudienceDrawer === 'hombre' ? 'Hombre' : 'Mujer'}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {currentCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(activeAudienceDrawer, cat.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? (activeAudienceDrawer === 'hombre' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'bg-pink-600 text-white font-bold shadow-xs')
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior Móvil: 6 pestañas ajustadas */}
      <nav 
        aria-label="Navegación principal móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-6 items-center h-16 px-0.5">
          
          {/* 1. Inicio */}
          <button
            onClick={() => handleNav('home', 'todos', 'todos')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isHomeActive ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isHomeActive ? 'bg-gray-100 scale-105' : ''}`}>
              <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tighter truncate max-w-full">Inicio</span>
          </button>

          {/* 2. Hombre */}
          <button
            onClick={() => handleAudienceClick('hombre')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isHombreActive ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isHombreActive ? 'bg-blue-50 scale-105' : ''}`}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tighter truncate max-w-full">Hombre</span>
          </button>

          {/* 3. Mujer */}
          <button
            onClick={() => handleAudienceClick('mujer')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isMujerActive ? 'text-pink-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isMujerActive ? 'bg-pink-50 scale-105' : ''}`}>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tighter truncate max-w-full">Mujer</span>
          </button>

          {/* 4. Nuevos */}
          <button
            onClick={() => handleNav('new')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isNewActive ? 'text-brand-dark font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isNewActive ? 'bg-gray-100 scale-105' : ''}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-brand-gold" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tighter truncate max-w-full">Nuevos</span>
          </button>

          {/* 5. Destacados */}
          <button
            onClick={() => handleNav('featured')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isFeaturedActive ? 'text-amber-800 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <div className={`p-1 rounded-full transition-transform ${isFeaturedActive ? 'bg-amber-100 scale-105' : ''}`}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tighter truncate max-w-full">Destacados</span>
          </button>

          {/* 6. Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 text-emerald-600 hover:text-emerald-700 active:scale-95 transition-transform"
          >
            <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shadow-xs">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-500/20 stroke-[2.2]" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold mt-0.5 text-emerald-700 truncate max-w-full">Chat</span>
          </a>

        </div>
      </nav>
    </>
  );
};
