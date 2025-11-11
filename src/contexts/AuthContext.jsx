import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth/authService";
import db from "../services/storage/db";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Get fresh user data from DB
      const userData = db.getById("users", currentUser.id);
      if (userData) {
        const sanitized = authService.sanitizeUser(userData);
        setUser(sanitized);
        // Update stored user
        localStorage.setItem("current_user", JSON.stringify(sanitized));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { user, token } = await authService.login(email, password);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { user, token } = await authService.register(userData);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
    }
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const userData = db.getById("users", currentUser.id);
      if (userData) {
        const sanitized = authService.sanitizeUser(userData);
        setUser(sanitized);
        localStorage.setItem("current_user", JSON.stringify(sanitized));
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
