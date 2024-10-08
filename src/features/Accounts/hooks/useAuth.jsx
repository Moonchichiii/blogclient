import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, userEndpoints } from '../../../api/endpoints';
import showToast from '../../../utils/Toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('access_token'));
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery(
    ['currentUser'],
    userEndpoints.getCurrentUser,
    {
      enabled: isAuthenticated,
      retry: false,
      onError: () => {
        setIsAuthenticated(false);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      },
    }
  );

  const loginMutation = useMutation(authEndpoints.login, {
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

  const logoutMutation = useMutation(authEndpoints.logout, {
    onSuccess: () => {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setIsAuthenticated(false);
      queryClient.clear();
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Logout failed', 'error');
    },
  });

  const refreshTokenMutation = useMutation(authEndpoints.refreshToken, {
    onSuccess: (data) => {
      Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' });
      setIsAuthenticated(true);
    },
    onError: () => {
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

    return () => clearInterval(refreshTokenPeriodically);
  }, [refreshTokenMutation]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading: isUserLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,
  }), [isAuthenticated, user, isUserLoading, loginMutation.mutate, logoutMutation.mutate, refreshTokenMutation.mutate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};