// useAuth.jsx
import { createContext, useContext, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authEndpoints, QUERY_KEYS } from '../../../api/endpoints';
import showToast from '../../../utils/toast';

class TokenManager {
  static getCookieOptions(days = 1) {
    const IS_PRODUCTION = import.meta.env.VITE_ENV === 'production';
    return {
      sameSite: IS_PRODUCTION ? 'strict' : 'lax',
      secure: IS_PRODUCTION,
      path: '/',
      expires: days
    };
  }

  static set(access, refresh) {
    Cookies.set('access_token', access, this.getCookieOptions(1));
    Cookies.set('refresh_token', refresh, this.getCookieOptions(7));
  }

  static clear() {
    const options = { path: '/' };
    Cookies.remove('access_token', options);
    Cookies.remove('refresh_token', options);
  }

  static async refresh() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await authEndpoints.refreshToken.request({ refresh: refreshToken });
      const { access } = response.data;
      Cookies.set('access_token', access, this.getCookieOptions(1));
      return access;
    } catch (error) {
      this.clear();
      throw error;
    }
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('access_token'));
  const [isActivating, setIsActivating] = useState(false);
  const [pending2FA, setPending2FA] = useState(null);
  const queryClient = useQueryClient();

  const handleTokenSet = (access, refresh, user = null) => {
    TokenManager.set(access, refresh);
    setIsAuthenticated(true);
    if (user) queryClient.setQueryData(QUERY_KEYS.auth.user, user);
  };

  const handleTokenClear = () => {
    TokenManager.clear();
    setIsAuthenticated(false);
    setPending2FA(null);
    queryClient.clear();
  };

  const userQuery = useQuery({
    queryKey: QUERY_KEYS.auth.user,
    queryFn: () => authEndpoints.getCurrentUser.request().then(res => res.data),
    enabled: isAuthenticated === true, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: false,
    onError: (error) => {
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        queryClient.clear();
      }
    }
  });

  const mutations = {
    login: useMutation({
      mutationFn: authEndpoints.login.request,
      onSuccess: (response) => {
        const { type, message, user_id } = response.data;
        if (type === 'success') {
          setIsAuthenticated(true);
          userQuery.refetch(); 
          showToast(message, type);
        } else if (type === '2fa_required') {
          setPending2FA({ user_id });
          showToast(message, 'info');
        } else {
          showToast(message, type || 'error');
        }
      },
      onError: (error) => {
        showToast(error.response?.data?.message || 'Login failed', 'error');
      }
    }),

    register: useMutation({
      mutationFn: authEndpoints.register.request,
      onSuccess: (response) => {
        showToast(response.data.message, response.data.type);
      },
      onError: (error) => {
        showToast(error.response?.data?.message || 'Registration failed', 'error');
      }
    }),

    activate: useMutation({
      mutationFn: authEndpoints.activateAccount.request,
      onMutate: () => setIsActivating(true),
      onSuccess: (response) => {
        if (response.data.verified) {
          handleTokenSet(response.data.access, response.data.refresh);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user });
          showToast('Email verified successfully!', 'success');
        }
      },
      onError: (error) => {
        showToast(error.response?.data?.message || 'Verification failed', 'error');
        handleTokenClear();
      },
      onSettled: () => setIsActivating(false)
    }),

    verify2FA: useMutation({
      mutationFn: ({ user_id, token }) => authEndpoints.verifyTwoFactor.request({ user_id, token }),
      onSuccess: (response) => {
        const { access, refresh, message, type } = response.data;
        handleTokenSet(access, refresh);
        setPending2FA(null);
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.user });
        showToast(message, type);
      },
      onError: (error) => {
        showToast(error.response?.data?.message || '2FA verification failed', 'error');
      }
    }),

    logout: useMutation({
      mutationFn: authEndpoints.logout.request,
      onSuccess: () => handleTokenClear(),
      onError: (error) => {
        showToast(error.response?.data?.message || 'Logout failed', 'error');
      }
    })
  };

  const transformRoles = (roles) => {
    if (!roles) return [];
    return Object.entries(roles)
      .filter(([key, value]) => value === true && key.startsWith('is_'))
      .map(([key]) => key.replace('is_', ''));
  };

  const userRoles = userQuery.data?.account?.roles || {};
  const hasRole = (role) => userRoles[`is_${role}`] === true;
  const hasAnyRole = (roleArray) => roleArray.some(hasRole);

  const value = useMemo(() => ({
    isAuthenticated,
    isActivating,
    activateAccount: mutations.activate.mutateAsync,
    user: userQuery.data,
    userRoles: transformRoles(userQuery.data?.account?.roles),
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isStaff: hasRole('staff'),
    isSuperuser: hasRole('superuser'),
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    login: mutations.login.mutateAsync,
    logout: mutations.logout.mutateAsync,
    register: mutations.register.mutateAsync,
    refreshToken: TokenManager.refresh,
    pending2FA,
    verify2FA: mutations.verify2FA.mutateAsync,
  }), [
    isAuthenticated,
    isActivating,
    userQuery.data,
    userQuery.isLoading,
    userQuery.error,
    pending2FA,
    mutations,
    hasRole
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default useAuth;




