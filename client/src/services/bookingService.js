import { fetchWithAuth } from './api';

export const bookingService = {
  create: async (bookingData) => {
    const response = await fetchWithAuth('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    return response.data || response;
  },

  getMyBookings: async () => {
    const response = await fetchWithAuth('/bookings/my');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getOwnerBookings: async () => {
    const response = await fetchWithAuth('/bookings/owner');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getById: async (bookingId) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}`);
    return response.data || response;
  },

  approve: async (bookingId) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}/approve`, {
      method: 'PUT'
    });
    return response.data || response;
  },

  reject: async (bookingId) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}/reject`, {
      method: 'PUT'
    });
    return response.data || response;
  },

  cancel: async (bookingId) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    });
    return response.data || response;
  },

  getAllBookings: async () => {
    const response = await fetchWithAuth('/bookings/all');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  updateStatus: async (bookingId, status, paymentStatus) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus })
    });
    return response.data || response;
  }
};



