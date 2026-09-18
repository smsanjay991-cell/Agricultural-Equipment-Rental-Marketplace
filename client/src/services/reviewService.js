import { fetchWithAuth } from './api';

export const reviewService = {
  create: async (reviewData) => {
    const response = await fetchWithAuth('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    return response.data || response;
  },

  getByEquipment: async (equipmentId) => {
    const response = await fetchWithAuth(`/reviews/equipment/${equipmentId}`);
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getMyReviews: async () => {
    const response = await fetchWithAuth('/reviews/my');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getAll: async () => {
    const response = await fetchWithAuth('/reviews');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  }
};
