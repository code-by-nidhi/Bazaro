import api from './api';

export const getDashboardStatsApi = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export const getAllOrdersAdminApi = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const updateOrderStatusAdminApi = async (id, statusData) => {
  const response = await api.put(`/orders/${id}/status`, statusData);
  return response.data;
};

export const getAllUsersAdminApi = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleUserStatusAdminApi = async (id) => {
  const response = await api.put(`/admin/users/${id}/status`);
  return response.data;
};

export const getActiveBannersApi = async () => {
  const response = await api.get('/banners');
  return response.data;
};

export const createBannerApi = async (formData) => {
  const response = await api.post('/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBannerApi = async (id) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};
