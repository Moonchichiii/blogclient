import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagEndpoints } from '../api/endpoints';

export const useTags = (postId) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError, error } = useQuery(
    ['tags', postId],
    () => tagEndpoints.getTags(postId)
  );

  const addTagMutation = useMutation(
    (newTag) => tagEndpoints.createTag(postId, newTag),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tags', postId]);
      },
    }
  );

  return {
    tags,
    isLoading,
    isError,
    error,
    addTag: addTagMutation.mutate,
  };
};