import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authEndpoints } from '../../../api/endpoints';
import { loginSuccess, logout } from '../authSlice'; // Use `logout`
import { fetchCurrentUser } from '../../Profile/hooks/profileSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authEndpoints.login(credentials);
      const { access, refresh } = response.data;
      Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
      dispatch(loginSuccess({ accessToken: access, refreshToken: refresh }));
      await dispatch(fetchCurrentUser());
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [dispatch]);

  const refreshTokenPeriodically = useCallback(() => {
    const interval = setInterval(async () => {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await authEndpoints.refreshToken(refreshToken);
          Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' });
          dispatch(loginSuccess({ accessToken: data.access, refreshToken }));
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) refreshTokenPeriodically();
  }, [isAuthenticated, refreshTokenPeriodically]);

  return useMemo(() => ({
    login, logout: logoutUser, isAuthenticated, loading,
  }), [login, logoutUser, isAuthenticated, loading]);
};

export default useAuth;
