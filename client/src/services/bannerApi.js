import api from './api';

// Public endpoint: the storefront home page renders the active banners.
// Banner management itself lives in the separate admin app.
export const getActiveBannersApi = async () => {
  const response = await api.get('/banners');
  return response.data;
};
