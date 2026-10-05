import React, { useState } from 'react';
import { Shield, KeyRound, Lock, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AdminLogin = ({ onBackToStore }) => {
  const [password, setPassword] = useState('');
  const { loginAdmin } = useProducts();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(password);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xl space-y-6 text-center animate-slide-up">
        
        <div className="w-16 h-16 rounded-2xl bg-brand-dark text-brand-champagne flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-display font-extrabold text-2xl text-brand-dark">
            Panel de Administración
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ingreso privado exclusivo para la administración de <strong>DULCE chic y sneaks</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la clave..."
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                autoFocus
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-smooth flex items-center justify-center gap-2"
          >
            <span>Ingresar al Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2">
          <button
            onClick={onBackToStore}
            className="text-xs font-semibold text-gray-500 hover:text-brand-dark transition-colors"
          >
            ← Regresar a la tienda pública
          </button>
        </div>

      </div>
    </div>
  );
};
