import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchProductsFromSupabase, createProductInSupabase, updateProductInSupabase, deleteProductFromSupabase } from '../services/supabaseService';

const ProductContext = createContext();

// Helper de normalización para asegurar que todo producto tenga su array de variants y availability sincronizada
const normalizeProduct = (p) => {
  const variants = (p.variants && Array.isArray(p.variants) && p.variants.length > 0)
    ? p.variants
    : [
        {
          id: `var-${p.id || Date.now()}-0`,
          color: 'Estilo Principal',
          price: p.price,
          imageUrl: p.imageUrl,
          available: p.available !== undefined ? Boolean(p.available) : true,
          reference: p.reference || ''
        }
      ];

  const formattedVariants = variants.map((v) => {
    const { sizes, ...rest } = v;
    return {
      ...rest,
      available: v.available !== undefined ? Boolean(v.available) : true,
      price: Number(v.price || 0)
    };
  });

  // Regla de oro: el producto general está disponible SI Y SOLO SI al menos una variante está disponible
  const isAnyAvailable = formattedVariants.some((v) => v.available);
  const mainVariant = formattedVariants[0];

  return {
    ...p,
    price: mainVariant?.price !== undefined ? Number(mainVariant.price) : Number(p.price || 0),
    imageUrl: mainVariant?.imageUrl || p.imageUrl || '',
    available: isAnyAvailable,
    variants: formattedVariants
  };
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Para modal de detalle
  const [toastMessage, setToastMessage] = useState(null);

  // Cargar productos desde Supabase al iniciar la aplicación
  const loadProducts = async () => {
    setLoading(true);
    const { success, data, error } = await fetchProductsFromSupabase();
    if (success && Array.isArray(data)) {
      setProducts(data.map(normalizeProduct));
    } else {
      console.error('Error al cargar productos desde Supabase:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Verificar y sincronizar sesión activa con Supabase Auth
  useEffect(() => {
    // 1. Obtener sesión activa existente al recargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminAuthenticated(!!session?.user);
    });

    // 2. Escuchar cambios de estado en Supabase Auth (inicio de sesión, cierre de sesión, etc.)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session?.user);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Autenticación administrativa con Supabase Auth
  const loginAdmin = async (email, password) => {
    try {
      const cleanEmail = (email || '').trim();
      const cleanPassword = (password || '').trim();

      if (!cleanEmail || !cleanPassword) {
        showToast('Ingresa tu correo y contraseña.', 'error');
        return { success: false, error: 'Campos requeridos vacíos.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        let msg = 'Error al iniciar sesión. Verifica tus credenciales.';
        if (error.message.includes('Invalid login credentials')) {
          msg = 'Correo o contraseña incorrectos. Verifica e intenta de nuevo.';
        } else if (error.message.includes('Email not confirmed')) {
          msg = 'El correo electrónico no ha sido confirmado en Supabase.';
        }
        showToast(msg, 'error');
        return { success: false, error: msg };
      }

      if (data?.user) {
        setIsAdminAuthenticated(true);
        showToast('¡Bienvenida al panel administrativo de DULCE chic y sneaks!', 'success');
        return { success: true, user: data.user };
      }

      return { success: false, error: 'No se pudo iniciar sesión.' };
    } catch (e) {
      console.error('Error inesperado en loginAdmin:', e);
      showToast('Error de conexión con Supabase Auth.', 'error');
      return { success: false, error: e.message };
    }
  };

  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdminAuthenticated(false);
      showToast('Sesión cerrada correctamente.', 'info');
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
      setIsAdminAuthenticated(false);
      showToast('Sesión cerrada.', 'info');
    }
  };

  // CRUD y acciones rápidas
  const addProduct = async (newProduct) => {
    try {
      const { success, data, error } = await createProductInSupabase(newProduct);
      if (success && data) {
        // Refrescar el catálogo directamente desde Supabase
        await loadProducts();
        showToast('¡Prenda y estilos agregados exitosamente a Supabase!', 'success');
        return { success: true, data };
      } else {
        const errorMsg = error?.message || 'Error desconocido al guardar en la base de datos';
        console.error('Error en createProductInSupabase:', error);
        showToast(`Error al guardar: ${errorMsg}`, 'error');
        return { success: false, error };
      }
    } catch (e) {
      console.error('Error inesperado en addProduct:', e);
      showToast('Error inesperado al guardar la prenda.', 'error');
      return { success: false, error: e };
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const { success, data, error } = await updateProductInSupabase(id, updatedFields);
      if (success) {
        // Refrescar el catálogo directamente desde Supabase
        await loadProducts();
        showToast('Prenda y estilos actualizados correctamente en Supabase.', 'success');
        return { success: true, data };
      } else {
        const errorMsg = error?.message || 'Error desconocido al actualizar en la base de datos';
        console.error('Error en updateProductInSupabase:', error);
        showToast(`Error al actualizar: ${errorMsg}`, 'error');
        return { success: false, error };
      }
    } catch (e) {
      console.error('Error inesperado en updateProduct:', e);
      showToast('Error inesperado al actualizar la prenda.', 'error');
      return { success: false, error: e };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { success, error } = await deleteProductFromSupabase(id);
      if (success) {
        // Refrescar el catálogo directamente desde Supabase
        await loadProducts();
        showToast('Prenda y estilos eliminados correctamente de Supabase.', 'info');
        return { success: true };
      } else {
        const errorMsg = error?.message || 'Error desconocido al eliminar en la base de datos';
        console.error('Error en deleteProductFromSupabase:', error);
        showToast(`Error al eliminar: ${errorMsg}`, 'error');
        return { success: false, error };
      }
    } catch (e) {
      console.error('Error inesperado en deleteProduct:', e);
      showToast('Error inesperado al eliminar la prenda.', 'error');
      return { success: false, error: e };
    }
  };

  // Métricas para el Dashboard
  const activeProducts = products.filter((p) => p.active !== false);

  // Total de variantes/estilos agotados en todos los productos activos
  const totalOutOfStockVariants = activeProducts.reduce((total, p) => {
    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      return total + p.variants.filter((v) => !v.available).length;
    }
    return total + (p.available ? 0 : 1);
  }, 0);

  const stats = {
    total: activeProducts.length,
    available: activeProducts.filter((p) => p.available).length,
    outOfStock: totalOutOfStockVariants,
    isNew: activeProducts.filter((p) => p.isNew).length,
    isFeatured: activeProducts.filter((p) => p.isFeatured).length,
    hombre: activeProducts.filter((p) => p.audience === 'hombre').length,
    mujer: activeProducts.filter((p) => p.audience === 'mujer').length
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        refreshProducts: loadProducts,
        activeProducts,
        stats,
        selectedProduct,
        setSelectedProduct,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
