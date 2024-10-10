import Cookies from 'js-cookie';
import { api, multipartApi } from '../../../api/apiConfig';

export const setupRefreshInterceptor = (refreshTokenFunction) => {
  const refreshInterceptor = async (error) => {
    if (error.response?.status === 401 && Cookies.get('refresh_token')) {
      try {
        await refreshTokenFunction();
        return api(error.config);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  };

  api.interceptors.response.use((response) => response, refreshInterceptor);
  multipartApi.interceptors.response.use((response) => response, refreshInterceptor);
};
