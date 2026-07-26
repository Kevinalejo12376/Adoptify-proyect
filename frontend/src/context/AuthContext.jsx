import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SUPER_ADMIN } from "../data/admin/mockData";
import { STORE_CREDENTIALS, mockStoreData } from "../data/store/mockStoreData";
import { loginRequest, registerRequest, fetchMe, logoutRequest, fetchProfile } from "../api/auth";
import { getToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // ─── Verificar si el perfil del usuario está completo ───
  const checkProfileStatus = useCallback(async () => {
    try {
      const profile = await fetchProfile();
      const isComplete = profile.perfil_completo === true;
      setProfileCompleted(isComplete);

      // Solo mostrar el modal UNA VEZ en la primera sesion despues del registro.
      // Usamos localStorage para recordar si ya se mostro el modal introductorio.
      const alreadyShown = localStorage.getItem("profile_intro_shown");
      if (!isComplete && getToken() && !alreadyShown) {
        const role = user?.role || user?.rol;
        // Solo para usuarios normales y refugios
        if (role === "usuario" || role === "refugio") {
          setShowProfileModal(true);
          // Marcar que ya se mostro para que no vuelva a aparecer
          localStorage.setItem("profile_intro_shown", "true");
        }
      }
    } catch {
      // Si hay error (ej: no autenticado), ignorar
    }
  }, [user]);

  // Al montar: si hay token JWT, restaura la sesion real desde el backend.
  // Si no, restaura una sesion mock (admin/tienda) guardada en localStorage.
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await fetchMe();
          setUser(me);
        } catch {
          logoutRequest();
        }
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
        }
      }
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        try { setFavorites(JSON.parse(storedFavorites)); } catch { /* ignore */ }
      }
      setLoading(false);
    };
    restore();
  }, []);

  // Cuando el usuario se cargue, verificar estado del perfil
  useEffect(() => {
    if (user && getToken()) {
      checkProfileStatus();
    }
  }, [user, checkProfileStatus]);

  // ===== AUTENTICACION REAL (usuario / refugio) contra el backend =====
  /** Login real. Devuelve el usuario (incluye .role). */
  const apiLogin = async (email, password) => {
    const me = await loginRequest(email, password);
    setUser(me);
    return me;
  };

  /** Registro real de usuario/refugio en la base de datos. */
  const apiRegister = async (payload) => {
    return registerRequest(payload);
  };

  /** Marcar perfil como completado (llamar desde el modal). */
  const markProfileCompleted = () => {
    setProfileCompleted(true);
    setShowProfileModal(false);
    // Actualizar el user en cache
    setUser((prev) => ({ ...prev, perfil_completo: true }));
  };

  /** Abrir el modal de completar perfil manualmente. */
  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  // ===== Setters mock (admin / tienda) =====
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    logoutRequest();            // limpia token JWT
    setUser(null);
    setFavorites([]);
    setShowProfileModal(false);
    setProfileCompleted(false);
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    window.location.href = "/";
  };

  // --- Admin Login (mock) ---
  const adminLogin = (email, password) => {
    if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
      const adminData = { ...SUPER_ADMIN, ultimoAcceso: new Date().toISOString() };
      setUser(adminData);
      localStorage.setItem("user", JSON.stringify(adminData));
      return { success: true, user: adminData };
    }
    return { success: false, error: "Credenciales incorrectas" };
  };

  // --- Store (Tienda Aliada) Login (mock) ---
  const storeLogin = (email, password) => {
    if (email === STORE_CREDENTIALS.email && password === STORE_CREDENTIALS.password) {
      const storeData = { ...mockStoreData, ultimoAcceso: new Date().toISOString() };
      setUser(storeData);
      localStorage.setItem("user", JSON.stringify(storeData));
      return { success: true, user: storeData };
    }
    return { success: false, error: "Credenciales incorrectas" };
  };

  const isAdmin = () => {
    const r = user?.role || user?.rol;
    return r === "administrador_principal" || r === "administrador";
  };
  const isStore = () => (user?.role || user?.rol) === "tienda_aliada";

  // ===== Favoritos (local) =====
  const addFavorite = (animal) => {
    setFavorites((prev) => {
      const nuevos = [...prev, animal];
      localStorage.setItem("favorites", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  const removeFavorite = (animalId) => {
    setFavorites((prev) => {
      const nuevos = prev.filter((fav) => fav.id !== animalId);
      localStorage.setItem("favorites", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  const isFavorite = (animalId) => favorites.some((fav) => fav.id === animalId);

  return (
    <AuthContext.Provider
      value={{
        user, loading, favorites,
        showProfileModal, setShowProfileModal,
        profileCompleted,
        apiLogin, apiRegister,       // reales (usuario/refugio)
        login, register, logout,     // mock setters
        adminLogin, storeLogin, isAdmin, isStore,
        addFavorite, removeFavorite, isFavorite,
        checkProfileStatus, markProfileCompleted, openProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
