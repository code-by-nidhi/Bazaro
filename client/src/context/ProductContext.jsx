import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getCategoriesApi } from '../services/categoryApi';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshCategories = useCallback(async () => {
    try {
      const data = await getCategoriesApi();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.warn('[ProductContext]: Failed to fetch categories', error.message);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Categories an admin has flagged for the storefront navigation, in admin order.
  const navCategories = categories.filter((cat) => cat.showInNavbar !== false);

  return (
    <ProductContext.Provider
      value={{
        categories,
        navCategories,
        loadingCategories,
        refreshCategories,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
