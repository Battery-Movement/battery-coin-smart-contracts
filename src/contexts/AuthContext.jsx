import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth as apiAuth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Here you would typically verify the token with the backend
      // For now, we'll assume the token is valid if it exists
      // and fetch user profile in a separate context or component.
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await apiAuth.login(credentials);
      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        setToken(data.data.token);
        // You might want to fetch and set user data here or in a separate UserContext
        return { success: true };
      }
      throw new Error(data.message || 'Login failed.');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await apiAuth.register(userData);
      if (data.success) {
        return { success: true, message: data.message };
      }
      throw new Error(data.message || 'Registration failed.');
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
