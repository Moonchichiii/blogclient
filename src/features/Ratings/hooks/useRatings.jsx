import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export const useRatings = (postId) => {
  const queryClient = useQueryClient();

  // Return early if no postId
  if (!postId) {
    return {
      rating: null,
      isLoading: false,
      isError: false,
      error: null,
      ratePost: () => {},
    };
  }

  // Get existing rating
  const {
    data: ratingData,
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ratings', postId],
    queryFn: async () => {
      try {
        const response = await ratingEndpoints.getRating(postId);
        return response.data.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!postId,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 60000, // Keep in cache for 1 minute
    refetchOnWindowFocus: false
  });

  // Create/Update rating mutation
  const rateMutation = useMutation({
    mutationFn: async (value) => {
      const response = await ratingEndpoints.ratePost(postId, value);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['ratings', postId], response.data);
      toast.success(response.message || 'Rating updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update rating';
      toast.error(message);
    },
  });

  // Create debounced version of the mutation
  const debouncedRatePost = debounce((value) => {
    // Skip if same value or invalid
    if (value === ratingData?.value || value < 1 || value > 5) return;
    rateMutation.mutate(value);
  }, 1000, { leading: false, trailing: true });

  return {
    rating: ratingData,
    isLoading: queryLoading || rateMutation.isLoading,
    isError,
    error,
    ratePost: debouncedRatePost,
    cleanup: () => {
      debouncedRatePost.cancel();
    }
  };
};

export default useRatings;