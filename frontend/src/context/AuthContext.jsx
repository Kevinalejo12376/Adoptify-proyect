import React, { createContext, useContext, useState, useEffect } from "react";
import { STORE_CREDENTIALS, mockStoreData } from "../data/store/mockStoreData";
import { loginRequest, registerRequest, fetchMe, logoutRequest } from "../api/auth";
import { getToken } from "../api/client";
import {
  listarMascotasFavoritas,
  agregarMascotaFavorita,
  quitarMascotaFavorita,
} from "../api/favoritos";

// Normaliza una mascota del backend a la forma que usan las vistas de favoritos.
const mapMascotaFav = (m) => ({
  id: m.id,
  name: m.nombre,
  type: m.tipo,
  breed: m.raza,
  age: m.edad,
  size: m.tamano,
  gender: m.genero,
  shelter: m.refugio_nombre,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Al montar: si hay token JWT, restaura la sesion real desde el backend.
  // Si no, restaura una sesion mock (admin/tienda) guardada en localStorage.
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await fetchMe();
          setUser(me);
          // Carga los favoritos de mascotas reales desde la base de datos.
          try {
            const favs = await listarMascotasFavoritas();
            setFavorites((favs || []).map(mapMascotaFav));
          } catch { /* sin favoritos */ }
        } catch {
          logoutRequest();
        }
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  // ===== AUTENTICACION REAL (usuario / refugio) contra el backend =====
  /** Login real. Devuelve el usuario (incluye .role). */
  const apiLogin = async (email, password) => {
    const me = await loginRequest(email, password);
    setUser(me);
    try {
      const favs = await listarMascotasFavoritas();
      setFavorites((favs || []).map(mapMascotaFav));
    } catch { /* sin favoritos */ }
    return me;
  };

  /** Registro real de usuario/refugio en la base de datos. */
  const apiRegister = async (payload) => {
    return registerRequest(payload);
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
    localStorage.removeItem("user");
    localStorage.removeItem("favorites");
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    window.location.href = "/";
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

  // ===== Favoritos de mascotas (persistidos en la base de datos) =====
  const addFavorite = (animal) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === animal.id) ? prev : [...prev, animal]
    );
    agregarMascotaFavorita(animal.id).catch(() => {});
  };

  const removeFavorite = (animalId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== animalId));
    quitarMascotaFavorita(animalId).catch(() => {});
  };

  const isFavorite = (animalId) => favorites.some((fav) => fav.id === animalId);

  return (
    <AuthContext.Provider
      value={{
        user, loading, favorites,
        apiLogin, apiRegister,       // reales (usuario/refugio)
        login, register, logout,     // mock setters
        storeLogin, isAdmin, isStore,
        addFavorite, removeFavorite, isFavorite,
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
