import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('nexora_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          localStorage.removeItem('nexora_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('nexora_token', res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.firstName}!`, 'success');
        return { success: true, role: res.data.user.role };
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        localStorage.setItem('nexora_token', res.data.token);
        setUser(res.data.user);
        showToast('Account created successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('nexora_token');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
