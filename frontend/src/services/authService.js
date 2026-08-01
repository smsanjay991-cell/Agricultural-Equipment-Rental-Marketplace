import { fetchWithAuth } from './api';

const MOCK_USERS = [
  {
    _id: 'u1',
    name: 'Harpreet Singh',
    email: 'farmer@agrirent.com',
    role: 'farmer',
    phone: '+91 98765 11111',
    location: 'Ludhiana, Punjab',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    _id: 'u2',
    name: 'Rajesh Patel',
    email: 'owner@agrirent.com',
    role: 'owner',
    phone: '+91 98765 22222',
    location: 'Karnal, Haryana',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    _id: 'u3',
    name: 'Admin Supervisor',
    email: 'admin@agrirent.com',
    role: 'admin',
    phone: '+91 98765 33333',
    location: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  }
];

export const authService = {
  login: async (email, password) => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return data;
    } catch (err) {
      // Mock fallback authentication for demo
      const user = MOCK_USERS.find(u => u.email === email) || {
        _id: 'u_' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email,
        role: email.includes('owner') ? 'owner' : email.includes('admin') ? 'admin' : 'farmer',
        phone: '+91 98765 43210',
        location: 'Punjab, India'
      };
      return {
        ...user,
        token: 'mock_jwt_token_' + Date.now()
      };
    }
  },

  register: async (userData) => {
    try {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return data;
    } catch (err) {
      return {
        _id: 'u_' + Date.now(),
        ...userData,
        token: 'mock_jwt_token_' + Date.now()
      };
    }
  },

  getProfile: async () => {
    try {
      return await fetchWithAuth('/auth/profile');
    } catch (err) {
      const stored = localStorage.getItem('agrirent_user');
      return stored ? JSON.parse(stored) : MOCK_USERS[0];
    }
  }
};
