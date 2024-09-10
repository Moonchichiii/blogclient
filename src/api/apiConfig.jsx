import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../store/store';
import { refreshTokenSuccess, logout } from '../store/authSlice';

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const multipartApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' },
});

let isRefreshing = false;
let refreshSubscribers = [];

const processQueue = (error, token = null) => {
  refreshSubscribers.forEach(cb => cb(error, token));
  refreshSubscribers = [];
};

const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token');
    const response = await axios.post(`${baseURL}/api/accounts/token/refresh/`, { refresh: refreshToken });
    const { access, refresh } = response.data;
    Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
    store.dispatch(refreshTokenSuccess({ accessToken: access, refreshToken: refresh }));
    return access;
  } catch (error) {
    throw error;
  }
};

const requestInterceptor = (config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

const responseInterceptor = async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((error, token) => {
          if (error) {
            reject(error);
          } else {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(api(originalRequest));
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
};

api.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
api.interceptors.response.use(response => response, responseInterceptor);

multipartApi.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
multipartApi.interceptors.response.use(response => response, responseInterceptor);