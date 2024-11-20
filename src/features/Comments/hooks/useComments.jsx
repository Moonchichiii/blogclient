// useComments.jsx
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { commentEndpoints } from '../../../api/endpoints';

export const useComments = (postId, enabled) => {
  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 1 }) => {
    const response = await commentEndpoints.getComments(postId, { page: pageParam });
    return response.data;
  };

  // New function to fetch only the comment count
  const fetchCommentCount = async () => {
    const response = await commentEndpoints.getCommentCount(postId); // Assuming `getCommentCount` returns only the count
    return response.data.count;
  };

  // Infinite query for comments
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: fetchComments,
    getNextPageParam: (lastPage) => (lastPage.next ? lastPage.page + 1 : undefined),
    enabled: !!postId && enabled,
  });

  // Query for comment count
  const { data: commentCountData } = useQuery({
    queryKey: ['commentCount', postId],
    queryFn: fetchCommentCount,
    enabled: !!postId,
    initialData: 0, // Initialize with 0 if no postId
  });

  const addCommentMutation = useMutation({
    mutationFn: (newComment) => commentEndpoints.createComment(postId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      queryClient.invalidateQueries(['commentCount', postId]); // Refresh count on new comment
    },
  });

  return {
    comments: data?.pages.flatMap((page) => page.results) || [],
    commentCount: commentCountData || 0, // Return comment count here
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    addComment: addCommentMutation.mutate,
  };
};
