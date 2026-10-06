import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { fetchProductsFromSupabase, createProductInSupabase } from '../services/supabaseService';

const ProductContext = createContext();

const STORAGE_KEY = 'dulce_products_v3';
const AUTH_KEY = 'dulce_admin_auth_v1';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

// Helper para verificar si la sesión administrativa sigue vigente (menos de 24 horas)
const checkAuthValidity = () => {
  try {
    const rawAuth = localStorage.getItem(AUTH_KEY);
    if (!rawAuth) return false;

    // Formato estructurado con tiempo de expiración
    if (rawAuth.startsWith('{')) {
      const parsed = JSON.parse(rawAuth);
      if (parsed?.authenticated && parsed?.expiresAt && Date.now() < parsed.expiresAt) {
        return true;
      }
    }
  } catch (e) {
    console.error('Error al verificar sesión administrativa:', e);
  }

  // Si no tiene fecha válida o ya expiraron las 24 horas, limpiar almacenamiento
  localStorage.removeItem(AUTH_KEY);
  return false;
};

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
          reference: p.reference || '',
          description: p.description || ''
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

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return checkAuthValidity();
  });

  const [selectedProduct, setSelectedProduct] = useState(null); // Para modal de detalle
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage:', e);
    }
  }, [products]);

  // Verificar periódicamente si la sesión administrativa de 24h ha expirado
  useEffect(() => {
    if (isAdminAuthenticated && !checkAuthValidity()) {
      setIsAdminAuthenticated(false);
      showToast('Tu sesión ha expirado por seguridad (límite de 24 horas).', 'info');
    }
  }, [isAdminAuthenticated]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Autenticación administrativa con expiración de 24 horas
  const loginAdmin = (password) => {
    // Clave predeterminada
    if (password === 'dulce2026' || password === 'admin123') {
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      const sessionData = {
        authenticated: true,
        expiresAt
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      setIsAdminAuthenticated(true);
      showToast('¡Bienvenida al panel administrativo de DULCE chic y sneaks!', 'success');
      return true;
    }
    showToast('Contraseña incorrecta. Intenta nuevamente.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    showToast('Sesión cerrada correctamente.', 'info');
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

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return normalizeProduct({ ...p, ...updatedFields, updatedAt: new Date().toISOString() });
        }
        return p;
      })
    );
    showToast('Prenda actualizada correctamente.');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Prenda eliminada del catálogo.', 'info');
  };

  const toggleAvailability = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = !p.available;
          showToast(newStatus ? 'Prenda y estilos marcados como Disponibles 🟢' : 'Prenda y estilos marcados como Agotados 🔴');
          
          // Sincronizar todas las variantes con el nuevo estado
          const updatedVariants = (p.variants || []).map((v) => ({
            ...v,
            available: newStatus
          }));

          return normalizeProduct({
            ...p,
            available: newStatus,
            variants: updatedVariants
          });
        }
        return p;
      })
    );
  };

  const toggleNew = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isNew: !p.isNew } : p))
    );
  };

  const toggleFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const toggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    showToast('Estado de visibilidad actualizado.');
  };

  const resetToDefaultProducts = () => {
    const normalizedDefaults = INITIAL_PRODUCTS.map(normalizeProduct);
    setProducts(normalizedDefaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedDefaults));
    showToast('Catálogo restablecido con los productos de fábrica.', 'info');
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
        toggleAvailability,
        toggleNew,
        toggleFeatured,
        toggleActive,
        resetToDefaultProducts,
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
