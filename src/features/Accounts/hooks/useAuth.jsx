import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, userEndpoints } from '../../../api/endpoints';
import { setupRefreshInterceptor } from './authInterceptor';
import showToast from '../../../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('access_token'));
  const [isActivating, setIsActivating] = useState(false);
  const queryClient = useQueryClient();

  const tokenManager = {
    set: (access, refresh) => {
      Cookies.set('access_token', access, { secure: true, sameSite: 'strict', expires: 1 });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict', expires: 7 });
      setIsAuthenticated(true);
    },
    clear: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      queryClient.removeQueries(['currentUser']);
    },
    refresh: async () => {
      try {
        const refreshTokenValue = Cookies.get('refresh_token');
        if (!refreshTokenValue) throw new Error('No refresh token available');
        
        const response = await authEndpoints.refreshToken(refreshTokenValue);
        const { access, refresh } = response.data;
        tokenManager.set(access, refresh);
        return access;
      } catch (error) {
        tokenManager.clear();
        throw error;
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setupRefreshInterceptor(tokenManager.refresh);
    }
  }, [isAuthenticated]);

  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userEndpoints.getCurrentUser().then(res => res.data),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    onError: (error) => {
      if (error.response?.status === 401) {
        tokenManager.clear();
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: authEndpoints.login,
    onSuccess: (response) => {
      const { access, refresh } = response.data;
      tokenManager.set(access, refresh);
      queryClient.invalidateQueries(['currentUser']);
      showToast(response.data.message, response.data.type);
      return response.data;
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authEndpoints.logout,
    onSuccess: () => {
      tokenManager.clear();
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Logout failed', 'error');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authEndpoints.register,
    onSuccess: (response) => {
      showToast(response.data.message, response.data.type);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    },
  });

  // Define activation mutation
  const activationMutation = useMutation({
    mutationFn: (token) => authEndpoints.activateAccount(token),
    onMutate: () => {
      setIsActivating(true);
    },
    onSuccess: (response) => {
      if (response.data.verified) {
        const { access, refresh } = response.data;
        tokenManager.set(access, refresh);
        queryClient.invalidateQueries(['currentUser']);
        showToast('Email verified successfully!', 'success');
      }
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Verification failed', 'error');
      tokenManager.clear();
    },
    onSettled: () => {
      setIsActivating(false);
    },
  });

  const value = useMemo(() => ({
    isAuthenticated,
    isActivating,
    activateAccount: activationMutation.mutateAsync,
    user: userQuery.data,
    roles: userQuery.data?.roles || [], 
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    refreshToken: tokenManager.refresh,
  }), [
    isAuthenticated,
    isActivating,
    activationMutation.mutateAsync,
    userQuery.data,
    userQuery.isLoading,
    userQuery.error,
    loginMutation.mutateAsync,
    logoutMutation.mutateAsync,
    registerMutation.mutateAsync,
  ]);

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
