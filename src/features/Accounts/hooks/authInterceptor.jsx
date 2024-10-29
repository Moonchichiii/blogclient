import Cookies from 'js-cookie';
import { api, multipartApi } from '../../../api/apiConfig';

export const setupRefreshInterceptor = (refreshTokenFunction) => {
  const refreshInterceptor = async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenFunction();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  };

  api.interceptors.response.use((response) => response, refreshInterceptor);
  multipartApi.interceptors.response.use((response) => response, refreshInterceptor);
};