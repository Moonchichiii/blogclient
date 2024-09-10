import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/userSlice';
import { loginSuccess, logoutSuccess } from '../store/authSlice';
import { authEndpoints, userEndpoints } from '../api/endpoints';
import Cookies from 'js-cookie';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    const response = await authEndpoints.login(credentials);
    const { access, refresh } = response.data;
    Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
    dispatch(loginSuccess({ accessToken: access, refreshToken: refresh }));
    await dispatch(fetchCurrentUser());
    return response.data;
  }, [dispatch]);

  const checkAuthStatus = useCallback(async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (accessToken && refreshToken) {
      try {
        await userEndpoints.getCurrentUser();
        dispatch(loginSuccess({ accessToken, refreshToken }));
        dispatch(fetchCurrentUser());
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const refreshTokenPeriodically = useCallback(() => {
    const refreshInterval = setInterval(() => {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        authEndpoints.refreshToken(refreshToken)
          .then(response => {
            const { access } = response.data;
            Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
            dispatch(loginSuccess({ accessToken: access, refreshToken }));
          })
          .catch(error => {
            console.error('Error refreshing token:', error);
            logout();
          });
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      return refreshTokenPeriodically();
    }
  }, [isAuthenticated, refreshTokenPeriodically]);

  const logout = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    dispatch(logoutSuccess());
  }, [dispatch]);

  return useMemo(() => ({
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    checkAuthStatus,
  }), [isAuthenticated, loading, user, login, logout, checkAuthStatus]);
};

export default useAuth;