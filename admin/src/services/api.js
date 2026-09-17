import axios from 'axios';
import { API_URL } from '../config/urls';

// The admin panel keeps its session under its own localStorage keys so it never
// collides with a storefront session, even if both are served from one domain.
export const ADMIN_TOKEN_KEY = 'bazaro_admin_token';
export const ADMIN_USER_KEY = 'bazaro_admin_user';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A 401/403 means the admin session is gone or was downgraded: clear it and
// send the browser back to the admin login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const onLoginRoute = window.location.pathname === '/login';

    if ((status === 401 || status === 403) && !onLoginRoute) {
      if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
