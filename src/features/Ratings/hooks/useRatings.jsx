import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingEndpoints } from '../../../api/endpoints';

export const useRatings = (postId) => {
  const queryClient = useQueryClient();

  const { data: rating, isLoading, isError, error } = useQuery({
    queryKey: ['ratings', postId],
    queryFn: () => ratingEndpoints.getRating(postId),
  });

  const rateMutation = useMutation({
    mutationFn: (value) => ratingEndpoints.ratePost(postId, value),
    onSuccess: () => {
      queryClient.invalidateQueries(['ratings', postId]);
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
