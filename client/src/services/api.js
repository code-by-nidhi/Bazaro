import axios from 'axios';
import { API_URL } from '../config/urls';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token automatically if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bazaro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized 401 token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on auth error if expired
      const isLoginRoute = window.location.pathname.includes('/login');
      if (!isLoginRoute && localStorage.getItem('bazaro_token')) {
        localStorage.removeItem('bazaro_token');
        localStorage.removeItem('bazaro_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
