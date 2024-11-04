import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ratingEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';

export const useRatings = (postId) => {
  const queryClient = useQueryClient();

  if (!postId) {
    return {
      rating: null,
      isLoading: false,
      isError: false,
      error: null,
      ratePost: () => {},
    };
  }

  const {
    data: ratingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ratings', postId],
    queryFn: () =>
      ratingEndpoints.getRating(postId).then((res) => res.data),
    enabled: !!postId,
  });

  const rateMutation = useMutation({
    mutationFn: (value) => ratingEndpoints.ratePost(postId, value),
    onSuccess: () => {
      queryClient.invalidateQueries(['ratings', postId]);
      queryClient.invalidateQueries(['posts']); 
      toast.success('Rating submitted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit rating.';
      toast.error(message);
    },
  });

  return {
    rating: ratingData,
    isLoading,
    isError,
    error,
    ratePost: rateMutation.mutate,
  };
};
