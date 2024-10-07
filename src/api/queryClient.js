import { QueryClient } from '@tanstack/react-query';
import showToast from '../utils/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // Handle errors globally
        showToast(error.message, 'error');
      },
    },
    mutations: {
      onError: (error) => {
        // Handle errors globally
        showToast(error.message, 'error');
      },
    },
  },
});

export default queryClient;
