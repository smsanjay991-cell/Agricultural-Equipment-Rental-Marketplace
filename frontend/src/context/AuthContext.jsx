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
      const data = await authService.login(email, password);
      if (data.token) {
        localStorage.setItem('agrirent_token', data.token);
      }
      setUser(data);
      setLoading(false);
      return data;
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
      const data = await authService.register(userData);
      if (data.token) {
        localStorage.setItem('agrirent_token', data.token);
      }
      setUser(data);
      setLoading(false);
      return data;
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
      _id: 'u_' + role,
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
