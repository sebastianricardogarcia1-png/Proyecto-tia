import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Layers, Sparkles, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CATEGORIES_HOMBRE, CATEGORIES_MUJER } from '../../data/categories';
import { ImageUploadCompressor } from './ImageUploadCompressor';

export const ProductFormModal = ({ productToEdit, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    audience: 'mujer', // 'hombre' | 'mujer'
    category: 'zapatos',
    description: '',
    isNew: false,
    isFeatured: false,
    reference: '',
    variants: [
      {
        id: `var-${Date.now()}-1`,
        color: 'Color Principal',
        price: '',
        imageUrl: '',
        available: true,
        reference: '',
        description: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      const existingVariants = productToEdit.variants && productToEdit.variants.length > 0
        ? productToEdit.variants
        : [
            {
              id: `var-${productToEdit.id || Date.now()}-1`,
              color: 'Estilo Principal',
              price: productToEdit.price || '',
              imageUrl: productToEdit.imageUrl || '',
              available: productToEdit.available !== undefined ? productToEdit.available : true,
              reference: productToEdit.reference || '',
              description: ''
            }
          ];

      setFormData({
        name: productToEdit.name || '',
        audience: productToEdit.audience || 'mujer',
        category: productToEdit.category || 'zapatos',
        description: productToEdit.description || '',
        isNew: !!productToEdit.isNew,
        isFeatured: !!productToEdit.isFeatured,
        reference: productToEdit.reference || '',
        variants: existingVariants.map(v => ({
          ...v,
          available: v.available !== undefined ? Boolean(v.available) : true
        }))
      });
    }
  }, [productToEdit]);

  const categories = formData.audience === 'hombre' ? CATEGORIES_HOMBRE : CATEGORIES_MUJER;

  const handleAudienceChange = (newAudience) => {
    const newCats = newAudience === 'hombre' ? CATEGORIES_HOMBRE : CATEGORIES_MUJER;
    setFormData((prev) => ({
      ...prev,
      audience: newAudience,
      category: newCats[0]?.id || 'zapatos'
    }));
  };

  // --- Manejo de Variantes ---
  const handleAddVariant = () => {
    const lastPrice = formData.variants[formData.variants.length - 1]?.price || '';
    const newVariant = {
      id: `var-${Date.now()}-${formData.variants.length + 1}`,
      color: `Color ${formData.variants.length + 1}`,
      price: lastPrice,
      imageUrl: '',
      available: true,
      reference: formData.reference ? `${formData.reference}-${formData.variants.length + 1}` : '',
      description: ''
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const handleRemoveVariant = (indexToRemove) => {
    if (formData.variants.length <= 1) {
      alert('El producto debe tener al menos un estilo o variante.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
      return { ...prev, variants: newVariants };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del modelo o producto es obligatorio.';
    }

    if (!formData.variants || formData.variants.length === 0) {
      newErrors.variants = 'Debes agregar al menos un estilo o variante.';
    } else {
      formData.variants.forEach((v, idx) => {
        if (!v.color.trim()) {
          newErrors[`variant_${idx}_color`] = 'El nombre del color/estilo es obligatorio.';
        }
        if (!v.price || isNaN(v.price) || Number(v.price) <= 0) {
          newErrors[`variant_${idx}_price`] = 'Ingresa un precio válido en pesos.';
        }
        if (!v.imageUrl) {
          newErrors[`variant_${idx}_image`] = 'Sube una fotografía para este estilo.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    // Normalizar precios numéricos en variantes
    const formattedVariants = formData.variants.map((v) => ({
      ...v,
      price: Number(v.price)
    }));

    const mainVariant = formattedVariants[0];

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        price: mainVariant.price,
        imageUrl: mainVariant.imageUrl,
        available: formattedVariants.some((v) => v.available),
        variants: formattedVariants,
        reference: formData.reference || mainVariant.reference || `DC-${Date.now().toString().slice(-4)}`
      });
    } catch (err) {
      console.error('Error al guardar producto:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[88vh] sm:max-h-[90vh] my-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 className="font-display font-bold text-xl text-brand-dark">
              {productToEdit ? 'Editar Producto y Estilos' : 'Agregar Nuevo Producto'}
            </h3>
            <p className="text-xs text-gray-500">
              Crea un modelo principal y agrega todos sus colores/variantes en una sola tarjeta.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-200/70 hover:bg-gray-200 text-gray-700 transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          
          {/* SECCIÓN 1: DATOS GENERALES DEL MODELO */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark border-b border-gray-200 pb-2">
              1. Información General del Modelo
            </h4>

            {/* Selector de Público */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Público / Colección
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAudienceChange('mujer')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                    formData.audience === 'mujer'
                      ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  👗 Colección Mujer
                </button>

                <button
                  type="button"
                  onClick={() => handleAudienceChange('hombre')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                    formData.audience === 'hombre'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  👔 Colección Hombre
                </button>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del Modelo y Referencia General */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Nombre del Modelo / Prenda * (Ej. Nike Air Force 1, Nike Dunk)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Nike Air Force 1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Ref General (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Ej. DC-AF1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                />
              </div>
            </div>

            {/* Descripción General */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Descripción General del Modelo / Materiales
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los detalles de la silueta, materiales, acabados..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
              />
            </div>

            {/* Destacados / Nuevo */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 text-brand-dark rounded"
                />
                <span>🆕 Marcar como Nuevo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <span>⭐ Marcar como Selección Especial</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 2: VARIANTES Y ESTILOS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  2. Estilos y Colores del Producto ({formData.variants.length})
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Otro Color / Estilo</span>
              </button>
            </div>

            {/* Listado de Tarjetas de Variante */}
            <div className="space-y-4">
              {formData.variants.map((variant, index) => {
                const colorError = errors[`variant_${index}_color`];
                const priceError = errors[`variant_${index}_price`];
                const imageError = errors[`variant_${index}_image`];

                return (
                  <div
                    key={variant.id || index}
                    className="p-4 sm:p-5 bg-gray-50/80 rounded-2xl border border-gray-200/90 space-y-4 relative"
                  >
                    {/* Header de la Variante */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-gray-800">
                          Estilo #{index + 1}: <span className="text-brand-dark font-extrabold">{variant.color || 'Sin nombre'}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          variant.available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}>
                          {variant.available ? '🟢 Disponible' : '🔴 Agotado'}
                        </span>
                      </div>

                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="Eliminar este estilo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar estilo</span>
                        </button>
                      )}
                    </div>

                    {/* Inputs de la Variante: Color, Precio, Ref y Disponibilidad */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {/* Color / Estilo */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Color / Nombre del Estilo *
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          placeholder="Ej. Azul, Rosa Pastel, Negro Stealth"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        />
                        {colorError && <p className="text-[11px] text-rose-500 mt-1">{colorError}</p>}
                      </div>

                      {/* Precio */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Precio ($ COP) *
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          placeholder="Ej. 240000"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        />
                        {priceError && <p className="text-[11px] text-rose-500 mt-1">{priceError}</p>}
                      </div>

                      {/* Disponibilidad */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Disponibilidad
                        </label>
                        <button
                          type="button"
                          onClick={() => handleVariantChange(index, 'available', !variant.available)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 shadow-2xs ${
                            variant.available
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                          }`}
                          title="Clic para cambiar estado de este estilo"
                        >
                          {variant.available ? '🟢 Disponible' : '🔴 Agotado'}
                        </button>
                      </div>
                    </div>

                    {/* Subida de Imagen para esta variante */}
                    <div>
                      <ImageUploadCompressor
                        currentImageUrl={variant.imageUrl}
                        onImageCompressed={(compressedDataUrl) => {
                          handleVariantChange(index, 'imageUrl', compressedDataUrl);
                        }}
                      />
                      {imageError && <p className="text-[11px] text-rose-500 mt-1">{imageError}</p>}
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-brand-dark rounded-2xl text-xs font-bold text-gray-700 hover:text-brand-dark transition-all flex items-center justify-center gap-2 bg-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Otro Color o Estilo a este Producto</span>
              </button>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-smooth"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-md transition-smooth flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                  <span>Guardando en Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Producto ({formData.variants.length} estilos)</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
