import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, LogOut, RotateCcw, Search, 
  Sparkles, Star, CheckCircle, XCircle, ShoppingBag, Eye, ExternalLink 
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatCOP } from '../../services/whatsappService';
import { Badge } from '../common/Badge';
import { ProductFormModal } from './ProductFormModal';

export const AdminDashboard = ({ onBackToStore }) => {
  const {
    products,
    stats,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
    toggleNew,
    toggleFeatured,
    resetToDefaultProducts,
    setSelectedProduct
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAudience, setFilterAudience] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (formData) => {
    if (productToEdit) {
      updateProduct(productToEdit.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Estás segura de eliminar "${name}" del catálogo?`)) {
      deleteProduct(id);
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('⚠️ ¿Estás segura de restablecer los productos demo de fábrica? Esta acción reemplazará los productos que hayas creado o editado.')) {
      resetToDefaultProducts();
    }
  };

  // Filtrado de la tabla administrativa
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.reference && p.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAudience = filterAudience === 'todos' || p.audience === filterAudience;

    return matchesSearch && matchesAudience;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-dark">
              Panel Administrativo
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Sesión Activa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Administra tus prendas, cambia disponibilidad y destaca novedades para <strong>DULCE chic y sneaks</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-smooth flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Prenda</span>
          </button>

          <button
            onClick={onBackToStore}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-smooth flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Tienda</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-500 rounded-xl transition-smooth"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards: Total, Agotados, Nuevos, Destacados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</span>
          <p className="font-display font-bold text-2xl text-brand-dark mt-1">{stats.total}</p>
        </div>

        {/* 2. Agotados */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">🔴 Agotados</span>
          <p className="font-display font-bold text-2xl text-rose-950 mt-1">{stats.outOfStock}</p>
        </div>

        {/* 3. Nuevos */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">🆕 Nuevos</span>
          <p className="font-display font-bold text-2xl text-brand-dark mt-1">{stats.isNew}</p>
        </div>

        {/* 4. Destacados */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">⭐ Destacados</span>
          <p className="font-display font-bold text-2xl text-amber-950 mt-1">{stats.isFeatured}</p>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o ref..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Quick Audience filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 w-full sm:w-auto"
          >
            <option value="todos">Todos los públicos</option>
            <option value="hombre">Solo Hombre</option>
            <option value="mujer">Solo Mujer</option>
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Prenda</th>
                <th className="py-3.5 px-4">Público / Categoría</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4 text-center">Nuevo</th>
                <th className="py-3.5 px-4 text-center">Destacado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  
                  {/* Prenda + Imagen + Variantes con Disponibilidad Individual */}
                  <td className="py-3.5 px-4">
                    {(() => {
                      const totalVariants = p.variants?.length || 1;
                      const availableCount = p.variants ? p.variants.filter(v => v.available).length : (p.available ? 1 : 0);
                      const outOfStockCount = totalVariants - availableCount;

                      return (
                        <div className="flex items-start gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0 mt-0.5"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-brand-dark block line-clamp-1">{p.name}</span>
                              {p.variants && p.variants.length > 1 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold shrink-0">
                                  {p.variants.length} estilos
                                </span>
                              )}
                            </div>

                            {/* Detalle visual de cada variante con su estado 🟢 / 🔴 */}
                            {p.variants && p.variants.length > 1 ? (
                              <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-gray-500">
                                  {availableCount === totalVariants ? (
                                    <span className="text-emerald-700 font-bold">🟢 Todos disponibles ({availableCount})</span>
                                  ) : outOfStockCount === totalVariants ? (
                                    <span className="text-rose-700 font-bold">🔴 Todos agotados ({totalVariants})</span>
                                  ) : (
                                    <span>
                                      <strong className="text-emerald-700">🟢 {availableCount} disp.</strong> · <strong className="text-rose-600">🔴 {outOfStockCount} {outOfStockCount === 1 ? 'agotada' : 'agotadas'}</strong>
                                    </span>
                                  )}
                                </p>
                                <div className="flex flex-wrap items-center gap-1">
                                  {p.variants.map((v) => (
                                    <span
                                      key={v.id}
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                                        v.available
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                          : 'bg-rose-50 text-rose-800 border-rose-200'
                                      }`}
                                      title={v.available ? `${v.color}: Disponible` : `${v.color}: Agotado`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${v.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                      <span>{v.color}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              p.reference && <span className="text-[10px] text-gray-400 font-mono block">{p.reference}</span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Público & Categoría */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={p.audience === 'hombre' ? 'hombre' : 'mujer'} size="xs">
                        {p.audience === 'hombre' ? 'Hombre' : 'Mujer'}
                      </Badge>
                      <span className="text-xs text-gray-600 capitalize">{p.category}</span>
                    </div>
                  </td>

                  {/* Precio / Rango */}
                  <td className="py-3.5 px-4 font-bold text-brand-dark">
                    {(() => {
                      const prices = p.variants && p.variants.length > 0 ? p.variants.map(v => v.price) : [p.price];
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      return minPrice === maxPrice ? formatCOP(minPrice) : `${formatCOP(minPrice)} - ${formatCOP(maxPrice)}`;
                    })()}
                  </td>

                  {/* Nuevo Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleNew(p.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        p.isNew
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-gray-50 text-gray-300 border-gray-200 hover:text-gray-500'
                      }`}
                      title={p.isNew ? 'Marcado como Nuevo' : 'No marcado'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Destacado Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        p.isFeatured
                          ? 'bg-amber-100 text-amber-600 border-amber-300'
                          : 'bg-gray-50 text-gray-300 border-gray-200 hover:text-gray-500'
                      }`}
                      title={p.isFeatured ? 'Marcado como Destacado' : 'No marcado'}
                    >
                      <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-500' : ''}`} />
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="p-2 rounded-xl text-gray-500 hover:text-brand-dark hover:bg-gray-100 transition-colors"
                        title="Ver detalle público"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar prenda"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Eliminar prenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No se encontraron prendas con los filtros actuales.
          </div>
        )}
      </div>

      {/* Zona Secundaria / Peligro */}
      <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p className="text-gray-400">
          Panel de Administración · <strong>DULCE chic & sneaks</strong>
        </p>

        <button
          onClick={handleResetDemo}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
          title="Restablecer el catálogo con los productos demo iniciales de prueba"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Productos Demo</span>
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <ProductFormModal
          productToEdit={productToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
};
