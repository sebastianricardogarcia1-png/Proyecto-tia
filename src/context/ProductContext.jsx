import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchProductsFromLaravel, 
  loginAdminInLaravel, 
  logoutAdminInLaravel, 
  checkAuthInLaravel, 
  getAdminToken, 
  setAdminToken, 
  removeAdminToken,
  createProductInLaravel,
  updateProductInLaravel,
  deleteProductInLaravel
} from '../services/laravelProductService';
import { normalizeProduct } from '../models/ProductModel';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminTokenState] = useState(() => getAdminToken());
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Para modal de detalle
  const [toastMessage, setToastMessage] = useState(null);

  // Cargar productos exclusivamente desde la API de Laravel + MySQL
  const loadProducts = async () => {
    setLoading(true);
    try {
      const laravelRes = await fetchProductsFromLaravel();
      if (laravelRes.success && Array.isArray(laravelRes.data)) {
        setProducts(laravelRes.data.map(normalizeProduct));
      } else {
        const errorMsg = laravelRes.error?.message || 'No fue posible conectar con el catálogo de Laravel.';
        console.error('Error al cargar productos desde Laravel API:', errorMsg);
        showToast('Error al conectar con el servidor de productos.', 'error');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error inesperado al cargar productos:', err);
      showToast('Error de conexión con el catálogo.', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Verificar y sincronizar sesión activa con Laravel Sanctum
  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      checkAuthInLaravel(token).then((res) => {
        if (res.success && res.user?.isAdmin) {
          setIsAdminAuthenticated(true);
          setAdminUser(res.user);
        } else {
          removeAdminToken();
          setAdminTokenState(null);
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      });
    } else {
      setIsAdminAuthenticated(false);
      setAdminUser(null);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Autenticación administrativa con Laravel Sanctum (con respaldo automático si se requiere)
  const loginAdmin = async (email, password) => {
    try {
      const cleanEmail = (email || '').trim();
      const cleanPassword = (password || '').trim();

      if (!cleanEmail || !cleanPassword) {
        showToast('Ingresa tu correo y contraseña.', 'error');
        return { success: false, error: 'Campos requeridos vacíos.' };
      }

      // 1. Intentar inicio de sesión en Laravel Sanctum
      const laravelAuth = await loginAdminInLaravel(cleanEmail, cleanPassword);

      if (laravelAuth.success && laravelAuth.token && laravelAuth.user?.isAdmin) {
        setAdminToken(laravelAuth.token);
        setAdminTokenState(laravelAuth.token);
        setAdminUser(laravelAuth.user);
        setIsAdminAuthenticated(true);
        showToast('¡Bienvenida al panel administrativo de DULCE chic y sneaks!', 'success');
        return { success: true, user: laravelAuth.user };
      }

      // Si Laravel retornó error
      if (laravelAuth.error) {
        showToast(laravelAuth.error, 'error');
        return { success: false, error: laravelAuth.error };
      }

      showToast('No fue posible iniciar sesión con el servidor.', 'error');
      return { success: false, error: 'Error de autenticación.' };
    } catch (e) {
      console.error('Error inesperado en loginAdmin:', e);
      showToast('Error de conexión con el servidor de autenticación.', 'error');
      return { success: false, error: e.message };
    }
  };

  const logoutAdmin = async () => {
    try {
      const token = getAdminToken();
      if (token) {
        await logoutAdminInLaravel(token);
      }
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    } finally {
      removeAdminToken();
      setAdminTokenState(null);
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      showToast('Sesión cerrada correctamente.', 'info');
    }
  };

  // CRUD y acciones rápidas conectadas a Laravel + MySQL
  const addProduct = async (newProduct) => {
    try {
      const token = getAdminToken();
      if (!token) {
        showToast('Debes iniciar sesión como administrador para crear productos.', 'error');
        return { success: false, error: 'No autorizado' };
      }

      const { success, data, error } = await createProductInLaravel(newProduct, token);
      if (success && data) {
        await loadProducts();
        showToast('¡Prenda y estilos guardados exitosamente en la tienda!', 'success');
        return { success: true, data };
      } else {
        const errorMsg = error || 'Error desconocido al guardar en la base de datos';
        console.error('Error en createProductInLaravel:', error);
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
      const token = getAdminToken();
      if (!token) {
        showToast('Debes iniciar sesión como administrador para editar productos.', 'error');
        return { success: false, error: 'No autorizado' };
      }

      const { success, data, error } = await updateProductInLaravel(id, updatedFields, token);
      if (success) {
        await loadProducts();
        showToast('Prenda y estilos actualizados correctamente.', 'success');
        return { success: true, data };
      } else {
        const errorMsg = error || 'Error desconocido al actualizar en la base de datos';
        console.error('Error en updateProductInLaravel:', error);
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
      const token = getAdminToken();
      if (!token) {
        showToast('Debes iniciar sesión como administrador para eliminar productos.', 'error');
        return { success: false, error: 'No autorizado' };
      }

      const { success, error } = await deleteProductInLaravel(id, token);
      if (success) {
        await loadProducts();
        showToast('Prenda eliminada correctamente del catálogo.', 'info');
        return { success: true };
      } else {
        const errorMsg = error || 'Error desconocido al eliminar en la base de datos';
        console.error('Error en deleteProductInLaravel:', error);
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
        adminToken,
        adminUser,
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
