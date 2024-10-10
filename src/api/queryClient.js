import { QueryClient } from '@tanstack/react-query';
import showToast from '../utils/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    },
    mutations: {
      onError: (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        const type = error.response?.data?.type || 'error';
        showToast(message, type);
      },
    },
  },
});

export default queryClient;