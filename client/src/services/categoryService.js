import { fetchWithAuth } from './api';

export const categoryService = {
  getAll: async () => {
    const response = await fetchWithAuth('/categories');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getById: async (id) => {
    const response = await fetchWithAuth(`/categories/${id}`);
    return response.data || response;
  },

  create: async (categoryData) => {
    const response = await fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
    return response.data || response;
  },

  update: async (id, categoryData) => {
    const response = await fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
    return response.data || response;
  },

  delete: async (id) => {
    return await fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
};
