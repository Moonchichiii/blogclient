import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentEndpoints } from '../api/endpoints';

export const useComments = (postId) => {
  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 1 }) => {
    const response = await commentEndpoints.getComments(postId, { page: pageParam });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery(
    ['comments', postId],
    fetchComments,
    {
      getNextPageParam: (lastPage) => lastPage.next ? lastPage.page + 1 : undefined,
    }
  );

  const addCommentMutation = useMutation(
    (newComment) => commentEndpoints.createComment(postId, newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
      },
    }
  );

  return {
    comments: data?.pages.flatMap(page => page.results) || [],
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    addComment: addCommentMutation.mutate,
  };
};