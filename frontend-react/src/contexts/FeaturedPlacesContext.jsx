import { createContext, useState, useContext, useCallback } from "react";

const FeaturedPlacesContext = createContext();

export const FeaturedPlacesProvider = ({ children }) => {
  const [featuredPlaces, setFeaturedPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem("featuredPlaces");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addFeatured = useCallback((place) => {
    setFeaturedPlaces(prev => {
      if (prev.length >= 3) return prev;
      if (prev.find(p => p.id === place.id)) return prev;
      const updated = [...prev, place];
      localStorage.setItem("featuredPlaces", JSON.stringify(updated));
      return updated;
    });
    return true;
  }, []);

  const removeFeatured = useCallback((placeId) => {
    setFeaturedPlaces(prev => {
      const updated = prev.filter(p => p.id !== placeId);
      localStorage.setItem("featuredPlaces", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    featuredPlaces,
    addFeatured,
    removeFeatured,
  };

  return (
    <FeaturedPlacesContext.Provider value={value}>
      {children}
    </FeaturedPlacesContext.Provider>
  );
};

export const useFeaturedPlaces = () => {
  const context = useContext(FeaturedPlacesContext);
  if (!context) {
    throw new Error("useFeaturedPlaces must be used within FeaturedPlacesProvider");
  }
  return context;
};
