import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { user as apiUser } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        setLoading(true);
        setError(null);
        try {
          const { data } = await apiUser.getProfile();
          if (data.success) {
            setProfile(data.data.user);
          } else {
            throw new Error(data.message || 'Failed to fetch profile.');
          }
        } catch (err) {
          setError(err.message);
          console.error('Fetch profile error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const value = {
    profile,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
