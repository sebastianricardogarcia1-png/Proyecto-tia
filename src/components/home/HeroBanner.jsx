import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Colección exclusiva de 6 imágenes publicitarias de alta resolución
 * para la presentación inicial (separadas completamente de las imágenes de productos del catálogo).
 */
const HERO_SLIDES = [
  {
    id: 'hero-1',
    imageUrl: '/hero/hero-1.jpg',
    title: 'Sneakers & Streetwear Culture'
  },
  {
    id: 'hero-2',
    imageUrl: '/hero/hero-2.jpg',
    title: 'Moda Chic & Tendencias 2026'
  },
  {
    id: 'hero-3',
    imageUrl: '/hero/hero-3.jpg',
    title: 'Calzado & Zapatillas Exclusivas'
  },
  {
    id: 'hero-4',
    imageUrl: '/hero/hero-4.jpg',
    title: 'Outfits Urbanos & Casuales'
  },
  {
    id: 'hero-5',
    imageUrl: '/hero/hero-5.jpg',
    title: 'Diseño Contemporáneo & Moda'
  },
  {
    id: 'hero-6',
    imageUrl: '/hero/hero-6.jpg',
    title: 'Estilo Streetwear & Accesorios'
  }
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Transición automática suave cada 4.5 segundos
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleScrollToCatalog = () => {
    const catalogElem = document.getElementById('catalogo-seccion');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative w-full h-[90vh] sm:h-[94vh] overflow-hidden flex flex-col justify-between items-center select-none bg-brand-dark"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      
      {/* 1. Carrusel de 6 Fotografías de Fondo de Pantalla Completa (Alta Resolución) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Filtros oscuros y degradados para contraste y elegancia cinematográfica */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/75 z-20 pointer-events-none" />
      </div>

      {/* Espacio superior para balance visual */}
      <div className="pt-4 relative z-30" />

      {/* 2. Contenido Central Sobrepuesto: Logo + Nombre "DULCE chic y sneaks" + Slogan */}
      <div className="relative z-30 max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-4 sm:space-y-6 my-auto animate-fade-in">
        
        {/* Logo Oficial Central con Anillo Dorado y Sombra */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/95 shadow-2xl bg-white p-1 ring-4 ring-brand-champagne/70 shadow-black/60 transition-transform duration-500 hover:scale-105">
            <img
              src="/logo-temp.jpeg"
              alt="Logo DULCE chic y sneaks"
              className="w-full h-full object-cover object-center rounded-full"
            />
          </div>
        </div>

        {/* Nombre de la Marca */}
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.05] drop-shadow-2xl">
          DULCE <br />
          <span className="bg-gradient-to-r from-white via-brand-champagne to-amber-200 bg-clip-text text-transparent">
            chic y sneaks
          </span>
        </h1>

      </div>

      {/* 4. Controles Inferiores: Barras de Progreso (6 Fotos) + Deslizar al Catálogo */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-4 pb-6 flex flex-col items-center gap-4">
        
        {/* Indicadores de las 6 imágenes */}
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = currentSlide === index;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? 'w-10 bg-brand-gold shadow-sm'
                    : 'w-2.5 bg-white/40 hover:bg-white/75'
                }`}
                title={`Ver fotografía ${index + 1}: ${slide.title}`}
              />
            );
          })}
        </div>

        {/* Indicador animado para bajar al Catálogo General */}
        <button 
          onClick={handleScrollToCatalog}
          className="cursor-pointer animate-bounce flex flex-col items-center text-white/80 hover:text-white transition-colors select-none pt-1"
          aria-label="Ver Catálogo"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>

      </div>

    </section>
  );
};
