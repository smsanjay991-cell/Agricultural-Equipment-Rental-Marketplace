import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('agrirent_user');
    return stored ? JSON.parse(stored) : null;
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
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
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
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrirent_token');
    localStorage.removeItem('agrirent_user');
  };

  const switchDemoRole = (role) => {
    const demoUser = {
      _id: role === 'owner' ? 2 : role === 'admin' ? 3 : 1,
      id: role === 'owner' ? 2 : role === 'admin' ? 3 : 1,
      name: role === 'farmer' ? 'Harpreet Singh (Farmer)' : role === 'owner' ? 'Rajesh Patel (Fleet Owner)' : 'System Administrator',
      email: `${role}@agrirent.com`,
      role: role,
      phone: '+91 98765 43210',
      location: 'Punjab, India',
      token: 'demo_token_' + role
    };
    localStorage.setItem('agrirent_token', demoUser.token);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

