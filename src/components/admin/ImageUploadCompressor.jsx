import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { compressImage } from '../../services/imageCompressor';

export const ImageUploadCompressor = ({ currentImageUrl, onImageCompressed }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressStats, setCompressStats] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const result = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82
      });

      setCompressStats({
        originalKb: result.originalSizeKb,
        compressedKb: result.compressedSizeKb,
        savingsPercent: result.savingsPercent
      });

      setPreviewUrl(result.dataUrl);
      onImageCompressed(result.dataUrl);
    } catch (err) {
      alert('Error al comprimir la imagen: ' + err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
        Fotografía de la Prenda (Compresión Automática)
      </label>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-brand-dark rounded-2xl transition-colors">
        
        {/* Preview box */}
        <div className="relative w-28 h-28 bg-gray-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-300">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}

          {isCompressing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
            </div>
          )}
        </div>

        {/* Upload Controls & Stats */}
        <div className="flex-1 space-y-2 text-center sm:text-left w-full">
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-smooth">
              <UploadCloud className="w-4 h-4" />
              <span>Seleccionar Foto desde Celular o PC</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-gray-400 mt-1">
              Formatos JPG, PNG o WebP. Se optimizará automáticamente para cargar súper rápido.
            </p>
          </div>

          {/* Compression badge */}
          {compressStats && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Optimizada: de <strong>{compressStats.originalKb} KB</strong> a solo{' '}
                <strong>{compressStats.compressedKb} KB</strong> (-{compressStats.savingsPercent}%)
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
