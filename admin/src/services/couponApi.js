import api from './api';

export const validateCouponApi = async (couponData) => {
  const response = await api.post('/coupons/validate', couponData);
  return response.data;
};

export const getAllCouponsApi = async () => {
  const response = await api.get('/coupons');
  return response.data;
};

export const createCouponApi = async (couponData) => {
  const response = await api.post('/coupons', couponData);
  return response.data;
};

export const deleteCouponApi = async (id) => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};
