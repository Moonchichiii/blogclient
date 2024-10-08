import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagEndpoints } from '../../../api/endpoints';

export const useTags = (postId) => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError, error } = useQuery({
    queryKey: ['tags', postId],
    queryFn: () => tagEndpoints.getTags(postId),
    enabled: !!postId,
  });

  const addTagMutation = useMutation({
    mutationFn: (newTag) => tagEndpoints.createTag(postId, newTag),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags', postId]);
      showToast('Tag added successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to add tag. Please try again.', 'error');
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
