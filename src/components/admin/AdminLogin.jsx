import React, { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AdminLogin = ({ onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { loginAdmin } = useProducts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginAdmin(email, password);
      if (!result?.success) {
        setErrorMessage(result?.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setErrorMessage('Error inesperado al conectar con Supabase Auth.');
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Campo Correo Electrónico */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="admin@dulcechic.com"
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                required
                autoFocus
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ingresa tu contraseña..."
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                required
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-fade-in">
              {errorMessage}
            </div>
          )}

          {/* Botón de Envío con estado de carga */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-smooth flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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
