// useAuth.jsx


import React, { createContext, useContext, useState, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, userEndpoints } from '../../../api/endpoints';
import showToast from '../../../utils/toast';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('access_token'));
  const [isActivating, setIsActivating] = useState(false);
  const [pending2FA, setPending2FA] = useState(null);
  const queryClient = useQueryClient();
  const isProduction = process.env.NODE_ENV === 'production';


  const tokenManager = {
    set: (access, refresh) => {
      Cookies.set('access_token', access, { secure: isProduction, sameSite: 'lax', expires: 1 });
      Cookies.set('refresh_token', refresh, { secure: isProduction, sameSite: 'lax', expires: 7 });
      setIsAuthenticated(true);
    },
    clear: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      setPending2FA(null);
      queryClient.removeQueries(['currentUser']);
    },
    refresh: async () => {
      try {
        const refreshTokenValue = Cookies.get('refresh_token');
        if (!refreshTokenValue) throw new Error('No refresh token available');
        const response = await authEndpoints.refreshToken({ refresh: refreshTokenValue });
        const { access } = response.data;
        Cookies.set('access_token', access, { secure: isProduction, sameSite: 'lax', expires: 1 });
        return access;
      } catch (error) {
        tokenManager.clear();
        throw error;
      }
    },
  };


  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userEndpoints.getCurrentUser().then((res) => res.data),
    enabled: isAuthenticated,
    initialData: () => queryClient.getQueryData(['currentUser']),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    onError: (error) => {
      if (error.response?.status === 401) tokenManager.clear();
    },
  });


  const loginMutation = useMutation({
    mutationFn: authEndpoints.login,
    onSuccess: (response) => {
      if (response.data.type === 'success') {
        const { tokens: { access, refresh }, user } = response.data;
        tokenManager.set(access, refresh);
        queryClient.setQueryData(['currentUser'], user);
        setIsAuthenticated(true);
        showToast(response.data.message, response.data.type);
      } else if (response.data.type === '2fa_required') {
        setPending2FA({ user_id: response.data.user_id });
        showToast(response.data.message, 'info');
      } else {
        showToast(response.data.message, response.data.type || 'error');
      }
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    },
});


  const logoutMutation = useMutation({
    mutationFn: authEndpoints.logout,
    onSuccess: () => tokenManager.clear(),
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


  const activationMutation = useMutation({
    mutationFn: (token) => authEndpoints.activateAccount(token),
    onMutate: () => setIsActivating(true),
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
    onSettled: () => setIsActivating(false),
  });


  const verify2FAMutation = useMutation({
    mutationFn: ({ user_id, token }) => authEndpoints.verifyTwoFactor({ user_id, token }),
    onSuccess: (response) => {
      const { access, refresh } = response.data;
      tokenManager.set(access, refresh);
      queryClient.invalidateQueries(['currentUser']);
      setPending2FA(null);
      showToast(response.data.message, response.data.type);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || '2FA verification failed', 'error');
    },
  });


  const login = async (credentials) => await loginMutation.mutateAsync(credentials);
  const verify2FA = async (data) => await verify2FAMutation.mutateAsync(data);


  const value = useMemo(
    () => ({
      isAuthenticated,
      isActivating,
      activateAccount: activationMutation.mutateAsync,
      user: userQuery.data,
      roles: userQuery.data?.roles || [],
      isLoading: userQuery.isLoading,
      error: userQuery.error,
      login,
      logout: logoutMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      refreshToken: tokenManager.refresh,
      pending2FA,
      verify2FA,
    }),
    [
      isAuthenticated,
      isActivating,
      activationMutation.mutateAsync,
      userQuery.data,
      userQuery.isLoading,
      userQuery.error,
      login,
      logoutMutation.mutateAsync,
      registerMutation.mutateAsync,
      pending2FA,
      verify2FA,
    ]
  );


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};