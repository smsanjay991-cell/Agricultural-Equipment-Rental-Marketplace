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
      if (user.token) {
        localStorage.setItem('agrirent_token', user.token);
      }
    } else {
      localStorage.removeItem('agrirent_user');
      localStorage.removeItem('agrirent_token');
    }
  }, [user]);


  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password, role);
      const token = response.token || (response.data && response.data.token);
      const userObj = response.data || response;

      // Strict role verification: ensure the returned user's role matches the requested role
      if (role && userObj?.role) {
        const normalizedReqRole = role.toLowerCase() === 'farmer' ? 'user' : role.toLowerCase();
        const normalizedUserRole = userObj.role.toLowerCase() === 'farmer' ? 'user' : userObj.role.toLowerCase();
        if (normalizedReqRole !== normalizedUserRole) {
          throw new Error('Invalid role or credentials.');
        }
      }

      if (token) {
        localStorage.setItem('agrirent_token', token);
      }
      setUser(userObj);
      setLoading(false);
      return userObj;
    } catch (err) {
      let msg;
      if (err.isNetworkError || err.message === 'Failed to fetch' || err.name === 'TypeError') {
        msg = 'Unable to connect to the server. Please try again.';
      } else if (
        err.status === 400 || 
        err.status === 401 || 
        err.status === 403 ||
        err.message?.toLowerCase().includes('role') ||
        err.message?.toLowerCase().includes('credential') ||
        err.message?.toLowerCase().includes('password') ||
        err.message?.toLowerCase().includes('email') ||
        err.message?.toLowerCase().includes('invalid')
      ) {
        msg = 'Invalid role or credentials. Please check your details and try again.';
      } else {
        msg = err.message || 'Unable to sign in. Please try again.';
      }
      setError(msg);
      setLoading(false);
      throw new Error(msg, { cause: err });
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
      throw new Error(msg, { cause: err });
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



