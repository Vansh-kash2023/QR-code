import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, API_BASE_URL]);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/faculty/profile');
          setUser(response.data.faculty);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout(); // Invalid token, logout user
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/faculty/login', {
        email,
        password
      });

      const { faculty, token: authToken } = response.data;
      
      setUser(faculty);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      
      return { success: true, faculty };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/faculty/register', userData);
      
      const { faculty, token: authToken } = response.data;
      
      setUser(faculty);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      
      return { success: true, faculty };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserStatus = (newStatus) => {
    if (user) {
      setUser(prev => ({
        ...prev,
        status: newStatus.code,
        status_message: newStatus.name,
        status_updated_at: newStatus.updated_at
      }));
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserStatus,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
