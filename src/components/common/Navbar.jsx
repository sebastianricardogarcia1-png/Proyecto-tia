import React, { useState, useRef } from 'react';
import { MessageCircle, Menu, X, Sparkles, Star, ChevronDown, ArrowRight } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../../services/whatsappService';
import { CATEGORIES_HOMBRE, CATEGORIES_MUJER } from '../../data/categories';

export const Navbar = ({
  activeView,
  setActiveView,
  audienceFilter,
  setAudienceFilter,
  selectedCategory = 'todos',
  setSelectedCategory
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileHombreOpen, setMobileHombreOpen] = useState(false);
  const [mobileMujerOpen, setMobileMujerOpen] = useState(false);

  // Toggle exclusivo para acordeones en menú móvil
  const toggleMobileHombre = () => {
    setMobileHombreOpen((prev) => {
      const next = !prev;
      if (next) setMobileMujerOpen(false);
      return next;
    });
  };

  const toggleMobileMujer = () => {
    setMobileMujerOpen((prev) => {
      const next = !prev;
      if (next) setMobileHombreOpen(false);
      return next;
    });
  };

  // Hover states for desktop dropdowns
  const [hombreHover, setHombreHover] = useState(false);
  const [mujerHover, setMujerHover] = useState(false);
  const hombreTimeoutRef = useRef(null);
  const mujerTimeoutRef = useRef(null);

  const whatsappUrl = getGeneralWhatsAppUrl();

  const handleNavClick = (view, audience = 'todos', category = 'todos') => {
    setActiveView(view);
    if (setAudienceFilter) setAudienceFilter(audience);
    if (setSelectedCategory) setSelectedCategory(category);
    
    setIsMobileMenuOpen(false);
    setMobileHombreOpen(false);
    setMobileMujerOpen(false);
    setHombreHover(false);
    setMujerHover(false);

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

  // Smooth hover handlers with small debounce to prevent accidental close
  const handleHombreMouseEnter = () => {
    if (hombreTimeoutRef.current) clearTimeout(hombreTimeoutRef.current);
    setHombreHover(true);
    setMujerHover(false);
  };

  const handleHombreMouseLeave = () => {
    hombreTimeoutRef.current = setTimeout(() => {
      setHombreHover(false);
    }, 180);
  };

  const handleMujerMouseEnter = () => {
    if (mujerTimeoutRef.current) clearTimeout(mujerTimeoutRef.current);
    setMujerHover(true);
    setHombreHover(false);
  };

  const handleMujerMouseLeave = () => {
    mujerTimeoutRef.current = setTimeout(() => {
      setMujerHover(false);
    }, 180);
  };

  const isHomeActive = activeView === 'home' && audienceFilter === 'todos' && selectedCategory === 'todos';
  const isHombreActive = activeView === 'home' && audienceFilter === 'hombre';
  const isMujerActive = activeView === 'home' && audienceFilter === 'mujer';
  const isNewActive = activeView === 'new';
  const isFeaturedActive = activeView === 'featured';

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-gray-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          
          {/* Esquina Superior Izquierda: Logo + Nombre de la Tienda */}
          <button
            onClick={() => handleNavClick('home', 'todos', 'todos')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group shrink-0"
            title="DULCE chic & sneaks - Inicio"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200/90 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo-temp.jpeg"
                alt="Logo DULCE chic y sneaks"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-extrabold text-sm sm:text-base md:text-lg text-brand-dark tracking-tight leading-none group-hover:text-brand-charcoal transition-colors">
                DULCE
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-gray-500 font-sans tracking-wide leading-tight mt-0.5">
                chic & sneaks
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links with Dropdowns on Hover */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            
            {/* 1. Inicio */}
            <button
              onClick={() => handleNavClick('home', 'todos', 'todos')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isHomeActive
                  ? 'bg-brand-dark text-white shadow-sm scale-[1.02]'
                  : 'text-gray-700 hover:text-brand-dark hover:bg-gray-100'
              }`}
            >
              Inicio
            </button>

            {/* 2. Hombre (Dropdown en Hover) */}
            <div
              className="relative"
              onMouseEnter={handleHombreMouseEnter}
              onMouseLeave={handleHombreMouseLeave}
            >
              <button
                onClick={() => handleNavClick('home', 'hombre', 'todos')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isHombreActive
                    ? 'bg-blue-600 text-white shadow-sm scale-[1.02]'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                <span>👔 Hombre</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hombreHover ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Hombre */}
              {hombreHover && (
                <div className="absolute left-0 top-full pt-2 z-50 w-56 animate-slide-up">
                  <div className="bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl shadow-2xl p-2 space-y-1">
                    <button
                      onClick={() => handleNavClick('home', 'hombre', 'todos')}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isHombreActive && selectedCategory === 'todos'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Ver Todo Hombre</span>
                      <ArrowRight className="w-3 h-3 text-blue-500" />
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {CATEGORIES_HOMBRE.map((cat) => {
                      const isCatActive = isHombreActive && selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('home', 'hombre', cat.id)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                            isCatActive
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'text-gray-700 hover:bg-blue-50/60 hover:text-blue-600'
                          }`}
                        >
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Mujer (Dropdown en Hover) */}
            <div
              className="relative"
              onMouseEnter={handleMujerMouseEnter}
              onMouseLeave={handleMujerMouseLeave}
            >
              <button
                onClick={() => handleNavClick('home', 'mujer', 'todos')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isMujerActive
                    ? 'bg-pink-600 text-white shadow-sm scale-[1.02]'
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50/60'
                }`}
              >
                <span>👗 Mujer</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mujerHover ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Mujer */}
              {mujerHover && (
                <div className="absolute left-0 top-full pt-2 z-50 w-56 animate-slide-up">
                  <div className="bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl shadow-2xl p-2 space-y-1">
                    <button
                      onClick={() => handleNavClick('home', 'mujer', 'todos')}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isMujerActive && selectedCategory === 'todos'
                          ? 'bg-pink-50 text-pink-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Ver Todo Mujer</span>
                      <ArrowRight className="w-3 h-3 text-pink-500" />
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {CATEGORIES_MUJER.map((cat) => {
                      const isCatActive = isMujerActive && selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick('home', 'mujer', cat.id)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                            isCatActive
                              ? 'bg-pink-600 text-white font-bold shadow-xs'
                              : 'text-gray-700 hover:bg-pink-50/60 hover:text-pink-600'
                          }`}
                        >
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Recién Llegados */}
            <button
              onClick={() => handleNavClick('new')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isNewActive
                  ? 'bg-brand-dark text-white shadow-sm scale-[1.02]'
                  : 'text-gray-700 hover:text-brand-dark hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Recién Llegados</span>
            </button>

            {/* 5. Selección Especial */}
            <button
              onClick={() => handleNavClick('featured')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isFeaturedActive
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs scale-[1.02]'
                  : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50/50'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Selección Especial</span>
            </button>
          </nav>

          {/* Right Actions: WhatsApp + Menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition-smooth"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500/20 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-smooth"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu with Accordion Subcategories */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 animate-slide-up px-4 pt-3 pb-6 space-y-2.5 shadow-2xl max-h-[80vh] overflow-y-auto">
          
          {/* Inicio */}
          <button
            onClick={() => handleNavClick('home', 'todos', 'todos')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base flex items-center justify-between ${
              isHomeActive ? 'bg-brand-dark text-white' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span>🏠 Inicio</span>
          </button>

          {/* Hombre Accordion */}
          <div className="rounded-xl border border-gray-200/80 overflow-hidden">
            <button
              onClick={toggleMobileHombre}
              className="w-full text-left px-4 py-3 font-bold text-base flex items-center justify-between bg-blue-50/50 text-blue-900"
            >
              <span>👔 Colección Hombre</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileHombreOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileHombreOpen && (
              <div className="p-2 bg-white space-y-1 border-t border-gray-100">
                <button
                  onClick={() => handleNavClick('home', 'hombre', 'todos')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-50"
                >
                  Ver Todo Hombre →
                </button>
                {CATEGORIES_HOMBRE.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick('home', 'hombre', cat.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mujer Accordion */}
          <div className="rounded-xl border border-gray-200/80 overflow-hidden">
            <button
              onClick={toggleMobileMujer}
              className="w-full text-left px-4 py-3 font-bold text-base flex items-center justify-between bg-pink-50/50 text-pink-900"
            >
              <span>👗 Colección Mujer</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileMujerOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileMujerOpen && (
              <div className="p-2 bg-white space-y-1 border-t border-gray-100">
                <button
                  onClick={() => handleNavClick('home', 'mujer', 'todos')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-pink-700 hover:bg-pink-50"
                >
                  Ver Todo Mujer →
                </button>
                {CATEGORIES_MUJER.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick('home', 'mujer', cat.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recién Llegados */}
          <button
            onClick={() => handleNavClick('new')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base flex items-center justify-between ${
              isNewActive ? 'bg-brand-dark text-white' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>Recién Llegados</span>
            </span>
          </button>

          {/* Selección Especial */}
          <button
            onClick={() => handleNavClick('featured')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base flex items-center justify-between ${
              isFeaturedActive ? 'bg-amber-100 text-amber-900' : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Selección Especial</span>
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
