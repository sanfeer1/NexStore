import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error('Failed to parse userInfo from localStorage', err);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('userInfo', JSON.stringify({ user: data.user, token: data.token }));
    }
    return data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('userInfo', JSON.stringify({ user: data.user, token: data.token }));
    }
    return data;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
  };

  // Update profile
  const updateProfile = async (userData) => {
    const { data } = await API.put('/auth/profile', userData);
    if (data.success) {
      setUser(data.user);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('userInfo', JSON.stringify({ user: data.user, token: data.token }));
      } else {
        const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
        localStorage.setItem('userInfo', JSON.stringify({ ...stored, user: data.user }));
      }
    }
    return data;
  };

  // Add address
  const addAddress = async (addressData) => {
    const { data } = await API.post('/auth/addresses', addressData);
    if (data.success) {
      setUser((prev) => ({ ...prev, addresses: data.addresses }));
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (stored.user) {
        stored.user.addresses = data.addresses;
        localStorage.setItem('userInfo', JSON.stringify(stored));
      }
    }
    return data;
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    const { data } = await API.delete(`/auth/addresses/${addressId}`);
    if (data.success) {
      setUser((prev) => ({ ...prev, addresses: data.addresses }));
      const stored = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (stored.user) {
        stored.user.addresses = data.addresses;
        localStorage.setItem('userInfo', JSON.stringify(stored));
      }
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
