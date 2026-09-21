import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('agrirent_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('agrirent_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrirent_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agrirent_user');
      localStorage.removeItem('agrirent_token');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const token = response.token || (response.data && response.data.token);
      const userObj = response.data || response;
      if (token) {
        localStorage.setItem('agrirent_token', token);
      }
      setUser(userObj);
      setLoading(false);
      return userObj;
    } catch (err) {
      let msg;
      if (err.status) {
        msg = err.message || (err.data && err.data.message) || `Request failed with status ${err.status}`;
      } else if (err.isNetworkError || err.message === 'Failed to fetch' || err.name === 'TypeError') {
        msg = 'Cannot connect to backend server. Please verify backend server is running.';
      } else {
        msg = err.message || 'Login failed';
      }
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      const token = response.token || (response.data && response.data.token);
      const userObj = response.data || response;
      if (token) {
        localStorage.setItem('agrirent_token', token);
      }
      setUser(userObj);
      setLoading(false);
      return userObj;
    } catch (err) {
      let msg;
      if (err.status) {
        msg = err.message || (err.data && err.data.message) || `Request failed with status ${err.status}`;
      } else if (err.isNetworkError || err.message === 'Failed to fetch' || err.name === 'TypeError') {
        msg = 'Cannot connect to backend server. Please verify backend server is running.';
      } else {
        msg = err.message || 'Registration failed';
      }
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data || response;
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem('agrirent_user', JSON.stringify(mergedUser));
      setLoading(false);
      return mergedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrirent_token');
    localStorage.removeItem('agrirent_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      error: null,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      updateProfile: async () => {}
    };
  }
  return context;
};



