import { fetchWithAuth } from './api';

export const userService = {
  getUsers: async () => {
    const response = await fetchWithAuth('/users');
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  }
};
