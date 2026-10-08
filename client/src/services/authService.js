import { fetchWithAuth } from './api';

export const authService = {
  login: async (email, password, role) => {
    const body = { email, password };
    if (role) body.role = role;
    return await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
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
  },

  updateProfile: async (userData) => {
    return await fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};


