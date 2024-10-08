import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, userEndpoints } from '../../../api/endpoints';
import showToast from '../../../utils/Toast';
import queryClient from '../../../api/queryClient'; // Import the queryClient

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    return !!accessToken && !!refreshToken;
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userEndpoints.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    retry: false,
    onSuccess: (data) => {
      setIsAuthenticated(true);
    },
    onError: (error) => {
      setIsAuthenticated(false);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  });

  const loginMutation = useMutation({
    mutationFn: authEndpoints.login,
    onSuccess: (data) => {
      const { access, refresh } = data;
      Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
      setIsAuthenticated(true);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authEndpoints.logout,
    onSuccess: (data) => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Logout failed', 'error');
    },
  });

  const refreshTokenMutation = useMutation({
    mutationFn: authEndpoints.refreshToken,
    onSuccess: (data) => {
      Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' });
      setIsAuthenticated(true);
    },
    onError: (error) => {
      setIsAuthenticated(false);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  });

  useEffect(() => {
    const refreshTokenPeriodically = setInterval(() => {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        refreshTokenMutation.mutate(refreshToken);
      }
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(refreshTokenPeriodically);
    };
  }, [refreshTokenMutation]);

  const value = useMemo(() => {
    return {
      isAuthenticated,
      user,
      isLoading: isUserLoading,
      login: loginMutation.mutate,
      logout: logoutMutation.mutate,
      refreshToken: refreshTokenMutation.mutate,
    };
  }, [isAuthenticated, user, isUserLoading, loginMutation.mutate, logoutMutation.mutate, refreshTokenMutation.mutate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
