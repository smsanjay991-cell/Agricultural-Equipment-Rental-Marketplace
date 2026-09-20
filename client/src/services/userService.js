import { fetchWithAuth } from './api';

export const userService = {
  getUsers: async () => {
    const response = await fetchWithAuth('/users');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },

  getUserById: async (id) => {
    const response = await fetchWithAuth(`/users/${id}`);
    return response.data || response;
  },

  updateUser: async (id, userData) => {
    const response = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return response.data || response;
  },

  deleteUser: async (id) => {
    const response = await fetchWithAuth(`/users/${id}`, {
      method: 'DELETE'
    });
    return response.data || response;
  },

  updateProfile: async (profileData) => {
    const response = await fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.data || response;
  }
};
