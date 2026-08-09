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
    return response.data || [];
  },

  getOwnerBookings: async () => {
    const response = await fetchWithAuth('/bookings/owner');
    return response.data || [];
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

  updateStatus: async (bookingId, status, paymentStatus) => {
    const response = await fetchWithAuth(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus })
    });
    return response.data || response;
  }
};

