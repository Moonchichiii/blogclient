import { QueryClient } from '@tanstack/react-query';
import showToast from '../utils/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, 
      cacheTime: 1800000,
      retry: (failureCount, error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true
    },
    mutations: {
      onError: (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        const type = error.response?.data?.type || 'error';
        showToast(message, type);
      }
    }
  }
});

// Global cache invalidation handlers
queryClient.invalidateQueries = async (queryKey) => {
  await queryClient.invalidateQueries({ queryKey, refetchType: 'active' });
};

export default queryClient;