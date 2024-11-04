import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

const requestInterceptor = (config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

const responseInterceptor = async (error) => {
  const originalRequest = error.config;
  const accessToken = Cookies.get('access_token');
  if (
    error.response &&
    error.response.status === 401 &&
    accessToken &&
    !originalRequest._retry &&
    Cookies.get('refresh_token')
  ) {
    originalRequest._retry = true;
    try {
      const refreshTokenValue = Cookies.get('refresh_token');
      const response = await axios.post(`${baseURL}/api/accounts/token/refresh/`, { refresh: refreshTokenValue });
      const { access } = response.data;
      Cookies.set('access_token', access, { secure: isProduction, sameSite: 'lax', expires: 1 });
      originalRequest.headers['Authorization'] = `Bearer ${access}`;
      return axios(originalRequest);
    } catch (refreshError) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, responseInterceptor);

export const multipartApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' },
});

multipartApi.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
multipartApi.interceptors.response.use((response) => response, responseInterceptor);

export default api;
