import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const Toast = () => {
  const { toastMessage } = useProducts();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110] animate-slide-up flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xl rounded-2xl max-w-md text-sm text-gray-800">
      {icons[type] || icons.success}
      <span className="font-medium leading-snug">{message}</span>
    </div>
  );
};
