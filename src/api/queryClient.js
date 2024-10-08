import { QueryClient } from '@tanstack/react-query';
import showToast from '../utils/Toast';

const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: (error) => {
          console.error('Query Error:', error);
          showToast(error.message, 'error');
        },
        onSuccess: (data) => {
          // Handle success
        },
        retry: 1, 
        staleTime: 1000 * 60 * 5, 
      },
      mutations: {
        onError: (error) => {
          console.error('Mutation Error:', error);
          showToast(error.message, 'error');
        },
        onSuccess: (data) => {
          // Handle success
        },
      },
    },
  });

  return queryClient;
};

const queryClient = createQueryClient();

export default queryClient;
