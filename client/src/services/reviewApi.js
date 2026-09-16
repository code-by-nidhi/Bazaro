import api from './api';

export const getProductReviewsApi = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

export const addReviewApi = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const deleteReviewApi = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
