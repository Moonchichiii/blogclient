import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, userEndpoints } from '../../../api/endpoints';
import { setupRefreshInterceptor } from './authInterceptor';
import showToast from '../../../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('access_token'));
  const queryClient = useQueryClient();

  const refreshToken = async () => {
    try {
      const refreshTokenValue = Cookies.get('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      const response = await authEndpoints.refreshToken(refreshTokenValue);
      const { access, refresh } = response.data;
      Cookies.set('access_token', access, { secure: false, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: false, sameSite: 'strict' });
      setIsAuthenticated(true);
      return access;
    } catch (error) {
      setIsAuthenticated(false);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setupRefreshInterceptor(refreshToken);
    }
  }, [isAuthenticated]);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userEndpoints.getCurrentUser().then(res => res.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    onError: () => {
      setIsAuthenticated(false);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  });

  const loginMutation = useMutation({
    mutationFn: authEndpoints.login,
    onSuccess: (response) => {
      const { access, refresh } = response.data; 
      Cookies.set('access_token', access, { secure: false, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: false, sameSite: 'strict' });
      setIsAuthenticated(true);
      queryClient.invalidateQueries(['currentUser']);
      showToast(response.data.message, response.data.type);
      return response.data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      showToast(message, 'error');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authEndpoints.logout,
    onSuccess: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Logout failed', 'error');
    },
  });

  useEffect(() => {
    const refreshTokenPeriodically = setInterval(() => {
      if (isAuthenticated) {
        refreshToken();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshTokenPeriodically);
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshToken,
  }), [isAuthenticated, user, isLoading, error, loginMutation.mutateAsync, logoutMutation.mutateAsync]);

  return (
    <AuthContext.Provider value={value}>
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
