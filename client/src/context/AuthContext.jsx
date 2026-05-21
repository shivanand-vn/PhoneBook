import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL, apiFetch } from '../config/api';

const AuthContext = createContext(null);

export { API_URL };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists and fetch user profile
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch('/api/auth/profile');

        const data = await response.json();
        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen to automatic logout events from API client
    const handleAutoLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, [token]);

  // Login User
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Register User (accepts FormData for avatar upload)
  const register = async (formData) => {
    setError(null);
    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Update Profile (name + avatar)
  const updateProfile = async (formData) => {
    try {
      const response = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');

      if (data.user) setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
