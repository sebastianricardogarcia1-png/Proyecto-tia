import React, { useState, useMemo } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { Toast } from './components/common/Toast';
import { HeroBanner } from './components/home/HeroBanner';
import { ProductGrid } from './components/catalog/ProductGrid';
import { SearchBar } from './components/catalog/SearchBar';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useProducts } from './context/ProductContext';
import { CATEGORIES_HOMBRE, CATEGORIES_MUJER } from './data/categories';
import { ArrowLeft } from 'lucide-react';

const normalizeSearchText = (text) =>
  (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function App() {
  const {
    products,
    activeProducts,
    selectedProduct,
    setSelectedProduct,
    isAdminAuthenticated,
    showToast
  } = useProducts();

  // Active View: 'home' | 'new' | 'featured' | 'admin'
  const [activeView, setActiveView] = useState('home');

  // Filter States for General Catalog (in Home view)
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('todos'); // 'todos' | 'hombre' | 'mujer'
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [availabilityFilter, setAvailabilityFilter] = useState('todos'); // 'todos' | 'disponible' | 'agotado'
  const [sortBy, setSortBy] = useState('default');

  const handleResetFilters = () => {
    setSearchQuery('');
    setAudienceFilter('todos');
    setSelectedCategory('todos');
    setAvailabilityFilter('todos');
    setSortBy('default');
  };

  // Helper name for active category
  const activeCategoryName = useMemo(() => {
    if (selectedCategory === 'todos') return null;
    const catList = audienceFilter === 'hombre' ? CATEGORIES_HOMBRE : audienceFilter === 'mujer' ? CATEGORIES_MUJER : [...CATEGORIES_HOMBRE, ...CATEGORIES_MUJER];
    const found = catList.find((c) => c.id === selectedCategory);
    return found ? found.name : selectedCategory;
  }, [audienceFilter, selectedCategory]);

  // Quick Share from card
  const handleQuickShare = (product) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | DULCE chic y sneaks`,
        text: `Mira ${product.name} por ${formatCOP(product.price)} en DULCE chic y sneaks`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('¡Enlace copiado al portapapeles!');
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.8 }
          });
        } catch (e) {}
      });
    }
  };

  // 1. Catálogo General (Filtrado para la vista Home)
  const filteredCatalogProducts = useMemo(() => {
    const query = normalizeSearchText(searchQuery);

    return activeProducts
      .filter((product) => {
        // Búsqueda por texto (Nombre, categoría, descripción, variantes/colores)
        if (query) {
          const nameMatch = normalizeSearchText(product.name).includes(query);
          const catMatch = normalizeSearchText(product.category).includes(query);
          const audienceMatch = normalizeSearchText(product.audience).includes(query);
          const descMatch = normalizeSearchText(product.description).includes(query);
          const refMatch = normalizeSearchText(product.reference).includes(query);
          const variantsMatch = product.variants?.some(
            (v) =>
              normalizeSearchText(v.color).includes(query) ||
              normalizeSearchText(v.reference).includes(query) ||
              normalizeSearchText(v.description).includes(query)
          );

          if (!nameMatch && !catMatch && !audienceMatch && !descMatch && !refMatch && !variantsMatch) {
            return false;
          }
        }

        // Filtro por Público (Hombre / Mujer)
        if (audienceFilter !== 'todos' && product.audience !== audienceFilter) {
          return false;
        }

        // Filtro por Categoría
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }

        // Filtro por Disponibilidad
        if (availabilityFilter === 'disponible' && !product.available) {
          return false;
        }
        if (availabilityFilter === 'agotado' && product.available) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return 0; // default order
      });
  }, [activeProducts, searchQuery, audienceFilter, selectedCategory, availabilityFilter, sortBy]);

  // 2. Vista Independiente: Recién Llegados (isNew === true)
  const newProducts = useMemo(() => {
    return activeProducts.filter((p) => p.isNew);
  }, [activeProducts]);

  // 3. Vista Independiente: Selección Especial (isFeatured === true)
  const featuredProducts = useMemo(() => {
    return activeProducts.filter((p) => p.isFeatured);
  }, [activeProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] pb-16 md:pb-0">
      
      {/* 1. Global Navbar visible en TODAS las vistas con menús desplegables */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudienceFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VISTA 1: INICIO (Presentación Pantalla Completa + Catálogo General al Bajar) */}
        {activeView === 'home' && (
          <div className="animate-fade-in">
            
            {/* Presentación Pantalla Completa */}
            <HeroBanner />

            {/* Catálogo General al Deslizar */}
            <section id="catalogo-seccion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 sm:space-y-8 scroll-mt-24">
              
              {/* Encabezado dinámico y limpio del Catálogo */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-dark">
                    {searchQuery ? (
                      <span>Búsqueda: <span className="font-medium italic text-gray-700">"{searchQuery}"</span></span>
                    ) : audienceFilter === 'hombre'
                      ? (selectedCategory !== 'todos' ? `Hombre: ${activeCategoryName}` : 'Colección Hombre')
                      : audienceFilter === 'mujer'
                      ? (selectedCategory !== 'todos' ? `Mujer: ${activeCategoryName}` : 'Colección Mujer')
                      : (selectedCategory !== 'todos' ? activeCategoryName : 'Catálogo General')}
                  </h2>
                </div>

                {/* Barra de Búsqueda + Contador de resultados + Botón Ver Todo */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="¿Qué estás buscando?"
                  />

                  <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                    <span className="px-3.5 py-2.5 rounded-2xl bg-gray-100 text-brand-dark text-xs font-bold whitespace-nowrap">
                      {filteredCatalogProducts.length} {filteredCatalogProducts.length === 1 ? 'producto' : 'productos'}
                    </span>

                    {(audienceFilter !== 'todos' || selectedCategory !== 'todos' || searchQuery) && (
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs font-bold transition-all whitespace-nowrap"
                        title="Ver todos los productos"
                      >
                        <span>✕ Ver Todo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid de Productos del Catálogo */}
              <ProductGrid
                products={filteredCatalogProducts}
                onSelectProduct={setSelectedProduct}
                onQuickShare={handleQuickShare}
                onResetFilters={handleResetFilters}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />

            </section>

          </div>
        )}

        {/* VISTA 2: RECIÉN LLEGADOS (Vista Independiente Dedicada) */}
        {activeView === 'new' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
            
            {/* Header de la Vista */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-dark">
                  Recién Llegados
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-brand-dark text-xs font-bold">
                  {newProducts.length} {newProducts.length === 1 ? 'prenda' : 'prendas'}
                </span>

                <button
                  onClick={() => {
                    setActiveView('home');
                    setAudienceFilter('todos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-smooth"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al Inicio</span>
                </button>
              </div>
            </div>

            {/* Grid Exclusivo de Recién Llegados */}
            <ProductGrid
              products={newProducts}
              onSelectProduct={setSelectedProduct}
              onQuickShare={handleQuickShare}
            />

          </div>
        )}

        {/* VISTA 3: SELECCIÓN ESPECIAL (Vista Independiente Dedicada) */}
        {activeView === 'featured' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
            
            {/* Header de la Vista */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-dark">
                  Selección Especial
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  {featuredProducts.length} {featuredProducts.length === 1 ? 'prenda' : 'prendas'}
                </span>

                <button
                  onClick={() => {
                    setActiveView('home');
                    setAudienceFilter('todos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-smooth"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al Inicio</span>
                </button>
              </div>
            </div>

            {/* Grid Exclusivo de Selección Especial */}
            <ProductGrid
              products={featuredProducts}
              onSelectProduct={setSelectedProduct}
              onQuickShare={handleQuickShare}
            />

          </div>
        )}

        {/* VISTA 4: PANEL ADMINISTRATIVO */}
        {activeView === 'admin' && (
          <div>
            {isAdminAuthenticated ? (
              <AdminDashboard onBackToStore={() => setActiveView('home')} />
            ) : (
              <AdminLogin onBackToStore={() => setActiveView('home')} />
            )}
          </div>
        )}

      </main>

      {/* Global Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Global Floating WhatsApp Button on Desktop */}
      <div className="hidden md:block">
        <WhatsAppFloatingButton />
      </div>

      {/* Global Toast Messages */}
      <Toast />

      {/* Global Footer */}
      <Footer
        setActiveView={setActiveView}
        setCatalogAudienceFilter={setAudienceFilter}
        setSelectedCategory={setSelectedCategory}
        setSearchQuery={setSearchQuery}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudienceFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

    </div>
  );
}
