import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const multipartApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token');
    const response = await axios.post(`${baseURL}/api/accounts/token/refresh/`, {
      refresh: refreshToken,
    });
    Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'strict' });
    return response.data.access;
  } catch (error) {
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

multipartApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

multipartApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return multipartApi(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);