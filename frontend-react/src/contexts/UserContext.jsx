import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI, register as registerAPI, logout as logoutAPI } from "../services/authService";
import { getProfile } from "../services/userService";
import { syncProfile } from "../services/recommendationService";

const UserContext = createContext();

const validateRegister = (data) => {
  if (!data.name || data.name.trim().length < 2)
    return 'Name must be at least 2 characters';
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    return 'Invalid email address';
  if (!data.password || data.password.length < 8)
    return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(data.password))
    return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(data.password))
    return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(data.password))
    return 'Password must contain a number';
  if (!/[@$!%*?&]/.test(data.password))
    return 'Password must contain a special character (@$!%*?&)';
  return null;
};

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : null;
  });

  const safeParseArray = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [interests, setInterests] = useState(() => safeParseArray("userInterests"));

  const [favorites, setFavorites] = useState(() => safeParseArray("userFavorites"));

  const [viewedEvents, setViewedEvents] = useState(() => safeParseArray("viewedEvents"));

  // Sync interests with localStorage when they change
  useEffect(() => {
    localStorage.setItem("userInterests", JSON.stringify(interests));
  }, [interests]);

  // Sync favorites with localStorage when they change
  useEffect(() => {
    localStorage.setItem("userFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync viewed events with localStorage when they change
  useEffect(() => {
    localStorage.setItem("viewedEvents", JSON.stringify(viewedEvents));
  }, [viewedEvents]);

  // Sync profile to Python engine when interests or favorites change
  useEffect(() => {
    if (user?.id && interests.length > 0) {
      const sessionCategories = viewedEvents
        .map(v => v.category)
        .filter(Boolean)

      syncProfile(user.id, interests, sessionCategories).catch(err =>
        console.error('Profile sync failed:', err)
      )
    }
  }, [interests, favorites])

  const login = async (credentials) => {
    try {
      console.log('Login request:', credentials)
      const res = await loginAPI({
        email: credentials.email.trim(),
        password: credentials.password
      })
      const raw = res.data
      console.log('Login response:', raw)

      const userData = {
        id: raw.id,
        email: raw.email,
        name: raw.name,
        username: raw.name || raw.username,
        role: raw.role,
        token: raw.token,
      }

      if (!userData.token) {
        throw new Error('No token received from server')
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', userData.token)

      try {
        const profileRes = await getProfile(userData.id)
        const profileData = profileRes.data
        localStorage.setItem('profile', JSON.stringify(profileData))
        setProfile(profileData)
      } catch (profileErr) {
        console.error('Failed to fetch profile:', profileErr)
      }

      const hasSeenInterests = localStorage.getItem(`hasSeenInterests_${userData.id}`)
      if (!hasSeenInterests) {
        localStorage.setItem(`hasSeenInterests_${userData.id}`, 'true')
        navigate('/interests')
      } else {
        navigate('/home')
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      if (err.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server — make sure Spring Boot is running')
      } else if (err.response?.status === 401) {
        const msg = err.response?.data?.errors?.[0] || 'Invalid email or password'
        throw new Error(msg)
      } else if (err.response?.status === 400) {
        throw new Error('Invalid data — check all fields')
      } else {
        throw new Error(err.message || 'Something went wrong — please try again')
      }
    }
  };

  const register = async (data) => {
    const validationError = validateRegister(data)
    if (validationError) {
      throw new Error(validationError)
    }
    try {
      const res = await registerAPI({
        name: data.name,
        email: data.email.trim(),
        password: data.password
      })
      console.log('Register success:', res.data)

      // Force navigation to login
      window.location.href = '/login'
      return res.data
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message)
      if (err.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server')
      } else if (err.response?.status === 409) {
        throw new Error('This email is already registered')
      } else if (err.response?.status === 400) {
        throw new Error('Invalid data — check all fields')
      } else {
        throw new Error('Something went wrong — please try again')
      }
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      if (user?.id) {
        localStorage.removeItem(`hasSeenInterests_${user.id}`)
      }
      setUser(null);
      setProfile(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userInterests");
      localStorage.removeItem("userFavorites");
      localStorage.removeItem("hasSeenInterests");
      localStorage.removeItem("viewedEvents");
      setInterests([]);
      setFavorites([]);
      setViewedEvents([]);
      navigate("/login");
    }
  };

  const toggleFavorite = (place) => {
    if (!user) {
      return false;
    }
    const exists = favorites.find((f) => f.id === place.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== place.id)
      : [...favorites, place];
    setFavorites(updated);
    return !exists;
  };

  const isFavorite = (placeId) => {
    return favorites.some((f) => f.id === placeId);
  };

  const trackView = (place) => {
    if (!place) return;
    const exists = viewedEvents.find((v) => v.id === place.id);
    if (!exists) {
      const updated = [...viewedEvents, place].slice(-20);
      setViewedEvents(updated);
    }
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    profile,
    login,
    logout,
    register,
    updateUser,
    interests,
    setInterests,
    favorites,
    toggleFavorite,
    isFavorite,
    viewedEvents,
    trackView,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
