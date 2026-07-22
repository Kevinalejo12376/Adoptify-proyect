import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [storeFavorites, setStoreFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("adoptify_store_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [shelterFavorites, setShelterFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("adoptify_shelter_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("adoptify_store_favorites", JSON.stringify(storeFavorites));
  }, [storeFavorites]);

  useEffect(() => {
    localStorage.setItem("adoptify_shelter_favorites", JSON.stringify(shelterFavorites));
  }, [shelterFavorites]);

  // ─── Store Favorites ───

  const addStoreFavorite = useCallback((product) => {
    setStoreFavorites((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeStoreFavorite = useCallback((productId) => {
    setStoreFavorites((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isStoreFavorite = useCallback(
    (productId) => {
      return storeFavorites.some((item) => item.id === productId);
    },
    [storeFavorites]
  );

  const toggleStoreFavorite = useCallback(
    (product) => {
      setStoreFavorites((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          return prev.filter((item) => item.id !== product.id);
        }
        return [...prev, product];
      });
    },
    []
  );

  // ─── Shelter Favorites ───

  const addShelterFavorite = useCallback((shelter) => {
    setShelterFavorites((prev) => {
      if (prev.some((item) => item.id === shelter.id)) return prev;
      return [...prev, shelter];
    });
  }, []);

  const removeShelterFavorite = useCallback((shelterId) => {
    setShelterFavorites((prev) => prev.filter((item) => item.id !== shelterId));
  }, []);

  const isShelterFavorite = useCallback(
    (shelterId) => {
      return shelterFavorites.some((item) => item.id === shelterId);
    },
    [shelterFavorites]
  );

  const toggleShelterFavorite = useCallback(
    (shelter) => {
      setShelterFavorites((prev) => {
        const exists = prev.some((item) => item.id === shelter.id);
        if (exists) {
          return prev.filter((item) => item.id !== shelter.id);
        }
        return [...prev, shelter];
      });
    },
    []
  );

  return (
    <FavoritesContext.Provider
      value={{
        storeFavorites,
        addStoreFavorite,
        removeStoreFavorite,
        isStoreFavorite,
        toggleStoreFavorite,
        shelterFavorites,
        addShelterFavorite,
        removeShelterFavorite,
        isShelterFavorite,
        toggleShelterFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
