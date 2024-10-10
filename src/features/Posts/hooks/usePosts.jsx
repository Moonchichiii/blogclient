import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';

export const usePosts = (params = {}) => {
  const queryClient = useQueryClient();

  const postsQuery = useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam = 1 }) =>
      postEndpoints.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.next ? lastPage.page + 1 : undefined,
    keepPreviousData: true,
  });

  // Mutation for approving a post
  const approvePostMutation = useMutation({
    mutationFn: (id) => postEndpoints.approvePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['unapprovedPosts']);
    },
  });

  // Mutation for disapproving a post
  const disapprovePostMutation = useMutation({
    mutationFn: ({ id, reason }) => postEndpoints.disapprovePost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['unapprovedPosts']);
    },
  });

  return {
    ...postsQuery,
    approvePost: approvePostMutation.mutateAsync,
    disapprovePost: disapprovePostMutation.mutateAsync,
  };
};
