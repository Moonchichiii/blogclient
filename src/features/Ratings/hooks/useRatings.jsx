import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingEndpoints } from '../api/endpoints';

export const useRatings = (postId) => {
  const queryClient = useQueryClient();

  const { data: rating, isLoading, isError, error } = useQuery(
    ['ratings', postId],
    () => ratingEndpoints.getRating(postId)
  );

  const rateMutation = useMutation(
    (value) => ratingEndpoints.ratePost(postId, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ratings', postId]);
      },
    }
  );

  return {
    rating,
    isLoading,
    isError,
    error,
    ratePost: rateMutation.mutate,
  };
};