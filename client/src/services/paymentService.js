import { fetchWithAuth } from './api';

export const paymentService = {
  create: async (paymentData) => {
    const response = await fetchWithAuth('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return response.data || response;
  },

  getByBooking: async (bookingId) => {
    const response = await fetchWithAuth(`/payments/booking/${bookingId}`);
    return response.data || response;
  },

  getMyPayments: async () => {
    const response = await fetchWithAuth('/payments/my');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getAll: async () => {
    const response = await fetchWithAuth('/payments');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  updateStatus: async (id, paymentStatus) => {
    const response = await fetchWithAuth(`/payments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus })
    });
    return response.data || response;
  }
};
