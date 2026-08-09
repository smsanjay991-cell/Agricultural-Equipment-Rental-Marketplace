import { fetchWithAuth } from './api';

export const authService = {
  login: async (email, password) => {
    return await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async () => {
    return await fetchWithAuth('/auth/profile');
  }
};

