import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUserApi, getMeApi } from '../services/authApi';
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../services/api';

export const AuthContext = createContext();

/**
 * Admin-only auth. Unlike the storefront this provider refuses to hold a
 * session for a non-admin account: a customer who signs in here is rejected
 * and nothing is persisted.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(ADMIN_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }, []);

  // Re-verify the stored session against the server on every load, so a revoked
  // or downgraded admin cannot keep using a stale localStorage payload.
  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMeApi();
        if (cancelled) return;

        if (data.success && data.user?.role === 'admin') {
          setUser(data.user);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
        } else {
          clearSession();
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  const login = async (email, password) => {
    const data = await loginUserApi({ email, password });

    if (!data.success || !data.token) {
      return { success: false, message: data.message || 'Login failed.' };
    }

    if (data.user?.role !== 'admin') {
      // Valid credentials, wrong privileges: keep nothing.
      clearSession();
      return { success: false, message: 'Access denied. Administrator privileges required.' };
    }

    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return { success: true, user: data.user };
  };

  const logout = () => clearSession();

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
