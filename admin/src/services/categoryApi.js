import api from './api';

export const getCategoriesApi = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategoryByIdentifierApi = async (identifier) => {
  const response = await api.get(`/categories/${identifier}`);
  return response.data;
};

export const createCategoryApi = async (formData) => {
  const response = await api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCategoryApi = async (id, formData) => {
  const response = await api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
