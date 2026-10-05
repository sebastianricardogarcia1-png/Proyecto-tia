import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-medium tracking-wide uppercase rounded-full transition-smooth';
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    new: 'bg-brand-dark text-white font-semibold shadow-sm',
    featured: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    outOfStock: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    available: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    hombre: 'bg-blue-50 text-blue-700 border border-blue-200',
    mujer: 'bg-pink-50 text-pink-700 border border-pink-200'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};
