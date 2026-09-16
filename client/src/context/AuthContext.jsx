import React, { createContext, useState, useEffect } from 'react';
import { loginUserApi, registerUserApi, getMeApi, updateProfileApi, saveAddressApi } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bazaro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('bazaro_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync Auth State with Server on Mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getMeApi();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('bazaro_user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.warn('[Auth Token Expired or Invalid]: Cleared session');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUserApi({ email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('bazaro_token', data.token);
      localStorage.setItem('bazaro_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerUserApi(userData);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('bazaro_token', data.token);
      localStorage.setItem('bazaro_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bazaro_token');
    localStorage.removeItem('bazaro_user');
  };

  const updateProfile = async (profileData) => {
    const data = await updateProfileApi(profileData);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem('bazaro_user', JSON.stringify(data.user));
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('bazaro_token', data.token);
      }
    }
    return data;
  };

  const saveAddress = async (addressData) => {
    const data = await saveAddressApi(addressData);
    if (data.success && data.addresses) {
      const updatedUser = { ...user, addresses: data.addresses };
      setUser(updatedUser);
      localStorage.setItem('bazaro_user', JSON.stringify(updatedUser));
    }
    return data;
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        saveAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
