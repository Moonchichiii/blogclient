import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';
import { useAuth } from '../../Accounts/hooks/useAuth';

export const usePosts = (params = {}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, roles } = useAuth();

  // Check if user is admin or superuser
  const isStaffOrAdmin =
    isAuthenticated && (roles.includes('admin') || roles.includes('superuser'));

  // **Modal State Management**
  const [modalState, setModalState] = useState({
    isCreateOpen: false,
    isDisapproveOpen: false,
    selectedPost: null,
    disapproveReason: '',
  });

  // **Modal Handlers**
  const modals = {
    openCreateModal: () =>
      setModalState((prev) => ({ ...prev, isCreateOpen: true })),
    closeCreateModal: () =>
      setModalState((prev) => ({ ...prev, isCreateOpen: false })),
    openDisapproveModal: (post) =>
      setModalState((prev) => ({
        ...prev,
        isDisapproveOpen: true,
        selectedPost: post,
      })),
    closeDisapproveModal: () =>
      setModalState((prev) => ({
        ...prev,
        isDisapproveOpen: false,
        selectedPost: null,
        disapproveReason: '',
      })),
    setDisapproveReason: (reason) =>
      setModalState((prev) => ({
        ...prev,
        disapproveReason: reason,
      })),
  };

  // **Main Posts Query with Infinite Scrolling**
  const {
    data,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = params.onlyMyPosts
        ? postEndpoints.getUserPosts
        : params.preview
        ? postEndpoints.getPostPreviews
        : postEndpoints.getPosts;

      const response = await endpoint({
        ...params,
        page: pageParam,
        page_size: 5,
      });

      return {
        results: response.data.results,
        nextPage: response.data.next ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  // **Unapproved Posts Query for Staff/Admin Only**
  const unapprovedPostsQuery = useQuery({
    queryKey: ['unapprovedPosts'],
    queryFn: () =>
      postEndpoints.getUnapprovedPosts().then((res) => res.data),
    enabled: isStaffOrAdmin, // Only fetch if user is authenticated and is an admin or superuser
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to fetch unapproved posts.';
      toast.error(message);
    },
  });

  // **Post Mutations**
  const mutations = {
    create: useMutation({
      mutationFn: (postData) => postEndpoints.createPost(postData),
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        toast.success('Post created successfully!');
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || 'Failed to create post.';
        toast.error(message);
      },
    }),

    update: useMutation({
      mutationFn: ({ id, postData }) =>
        postEndpoints.updatePost(id, postData),
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        toast.success('Post updated successfully!');
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || 'Failed to update post.';
        toast.error(message);
      },
    }),

    delete: useMutation({
      mutationFn: (id) => postEndpoints.deletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        toast.success('Post deleted successfully!');
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || 'Failed to delete post.';
        toast.error(message);
      },
    }),

    approve: useMutation({
      mutationFn: (id) => postEndpoints.approvePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', 'unapprovedPosts']);
        toast.success('Post approved successfully!');
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || 'Failed to approve post.';
        toast.error(message);
      },
    }),

    disapprove: useMutation({
      mutationFn: ({ id, reason }) =>
        postEndpoints.disapprovePost(id, reason),
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', 'unapprovedPosts']);
        toast.success('Post disapproved successfully!');
        modals.closeDisapproveModal();
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || 'Failed to disapprove post.';
        toast.error(message);
      },
    }),
  };

  // **Post Action Handlers**
  const handlers = {
    approvePost: async (id) => {
      if (window.confirm('Are you sure you want to approve this post?')) {
        try {
          await mutations.approve.mutateAsync(id);
        } catch (error) {
          // Error handling is managed in the mutation's onError
        }
      }
    },

    disapprovePost: async () => {
      if (
        !modalState.selectedPost ||
        !modalState.disapproveReason.trim()
      ) {
        toast.warning('Please provide a reason for disapproval.');
        return;
      }

      try {
        await mutations.disapprove.mutateAsync({
          id: modalState.selectedPost.id,
          reason: modalState.disapproveReason,
        });
      } catch (error) {
        // Error handling is managed in the mutation's onError
      }
    },
  };

  return {
    // **Posts Data and Status**
    posts: data?.pages.flatMap((page) => page.results) || [],
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    error,

    // **Unapproved Posts Data** (conditionally available)
    unapprovedPosts: unapprovedPostsQuery.data || [],
    isLoadingUnapproved: unapprovedPostsQuery.isLoading,

    // **Modal Management**
    modalState,
    modals,

    // **Post Actions**
    ...handlers,

    // **Mutations with Loading States**
    createPost: mutations.create.mutateAsync,
    updatePost: mutations.update.mutateAsync,
    deletePost: mutations.delete.mutateAsync,
    isCreating: mutations.create.isLoading,
    isUpdating: mutations.update.isLoading,
    isDeleting: mutations.delete.isLoading,
    isApproving: mutations.approve.isLoading,
    isDisapproving: mutations.disapprove.isLoading,
  };
};
