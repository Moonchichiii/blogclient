import { QueryClient } from '@tanstack/react-query';
import showToast from '../utils/Toast';

/**
 * Initializes a QueryClient with global error handling for queries and mutations.
 * @returns {QueryClient} Configured QueryClient instance.
 */
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        onError: (error) => {
          showToast(error.message, 'error');
        },
      },
      mutations: {
        onError: (error) => {
          showToast(error.message, 'error');
        },
      },
    },
  });
};

const queryClient = createQueryClient();

export default queryClient;
