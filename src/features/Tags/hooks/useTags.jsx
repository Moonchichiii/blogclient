import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagEndpoints } from '../../../api/endpoints';

export const useTags = (postId) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError, error } = useQuery({
    queryKey: ['tags', postId],
    queryFn: () => tagEndpoints.getTags(postId),
  });

  const addTagMutation = useMutation({
    mutationFn: (taggedUserName) => tagEndpoints.createTag('post', postId, taggedUserName),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags', postId]);
    },
  });

  return {
    tags,
    isLoading,
    isError,
    error,
    addTag: addTagMutation.mutate,
  };
};

