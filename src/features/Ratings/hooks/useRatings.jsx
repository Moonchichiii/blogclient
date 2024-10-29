import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ratingEndpoints } from '../../../api/endpoints';

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
    data: rating,
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
    },
    onError: (error) => {
      // Handle error if needed
    },
  });

  return {
    rating,
    isLoading,
    isError,
    error,
    ratePost: rateMutation.mutate,
  };
};
