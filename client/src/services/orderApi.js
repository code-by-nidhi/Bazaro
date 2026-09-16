import api from './api';

export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getOrderByIdApi = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createRazorpayOrderApi = async (orderData) => {
  const response = await api.post('/payments/razorpay-order', orderData);
  return response.data;
};

export const verifyRazorpayPaymentApi = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};
