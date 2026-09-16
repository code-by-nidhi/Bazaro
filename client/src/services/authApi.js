import api from './api';

export const registerUserApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfileApi = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const saveAddressApi = async (addressData) => {
  const response = await api.put('/auth/address', addressData);
  return response.data;
};
