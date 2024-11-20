import { useState, useCallback } from 'react';
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';
import { throttle } from 'lodash';
import { useAuth } from '../../Accounts/hooks/useAuth';

// Constants aligned with backend pagination
const POSTS_PER_PAGE = 5; // Matches PostCursorPagination.page_size
const STALE_TIME = 60 * 15 * 1000; // 15 minutes - aligned with cache_page decorator
const CACHE_TIME = 60 * 30 * 1000; // 30 minutes

export const usePosts = (params = {}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const userRoles = user?.account?.roles || {};
  const isStaffOrAdmin = isAuthenticated && (
    userRoles.is_admin ||
    userRoles.is_superuser ||
    userRoles.is_staff
  );

  // Modal State Management (unchanged)
  const [modalState, setModalState] = useState({
    isCreateOpen: false,
    isDisapproveOpen: false,
    selectedPost: null,
    disapproveReason: '',
  });

  // Modal Handlers (unchanged)
  const modals = {
    openCreateModal: useCallback(() =>
      setModalState((prev) => ({ ...prev, isCreateOpen: true })), []),
    closeCreateModal: useCallback(() =>
      setModalState((prev) => ({
        ...prev,
        isCreateOpen: false,
        selectedPost: null,
      })), []),
    openDisapproveModal: useCallback((post) =>
      setModalState((prev) => ({
        ...prev,
        isDisapproveOpen: true,
        selectedPost: post,
      })), []),
    closeDisapproveModal: useCallback(() =>
      setModalState((prev) => ({
        ...prev,
        isDisapproveOpen: false,
        selectedPost: null,
        disapproveReason: '',
      })), []),
    setDisapproveReason: useCallback((reason) =>
      setModalState((prev) => ({
        ...prev,
        disapproveReason: reason,
      })), []),
  };

  // Main Posts Query - Aligned with PostList view
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = params.onlyMyPosts
        ? postEndpoints.getUserPosts
        : postEndpoints.getPosts;

      // Align params with backend filterset_fields and search_fields
      const adjustedParams = {
        page: pageParam,
        page_size: POSTS_PER_PAGE,
        ordering: params.ordering || '-created_at',
        search: params.search || '',
        author: params.onlyMyPosts ? 'current' : undefined,
      };

      // Handle is_approved filter
      if (params.isApproved !== undefined) {
        adjustedParams.is_approved = params.isApproved;
      }

      const response = await endpoint(adjustedParams);

      return {
        items: response.data.results,
        nextPage: response.data.next ? pageParam + 1 : undefined,
        totalCount: response.data.count,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: isAuthenticated || !params.onlyMyPosts,
  });

  // Unapproved Posts Query - Aligned with UnapprovedPostList view
  const unapprovedPostsQuery = useInfiniteQuery({
    queryKey: ['posts', 'unapproved'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!isStaffOrAdmin) {
        return {
          items: [],
          nextPage: undefined,
          totalCount: 0,
        };
      }

      try {
        const response = await postEndpoints.getUnapprovedPosts({
          page: pageParam,
          page_size: POSTS_PER_PAGE,
        });
        return {
          items: response.data.results,
          nextPage: response.data.next ? pageParam + 1 : undefined,
          totalCount: response.data.count,
        };
      } catch (error) {
        if (error.response?.status === 401) {
          return {
            items: [],
            nextPage: undefined,
            totalCount: 0,
          };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: isStaffOrAdmin && isAuthenticated,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    onError: (error) => {
      if (isStaffOrAdmin && error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Failed to fetch unapproved posts');
      }
    },
  });

  // Mutations aligned with backend endpoints
  const mutations = {
    create: useMutation({
      mutationFn: (postData) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(postData)) {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
        return postEndpoints.createPost(formData);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries(['posts']);
        toast.success(response.data?.message || 'Post created successfully!');
        modals.closeCreateModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create post.');
      },
    }),

    update: useMutation({
      mutationFn: ({ id, postData }) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(postData)) {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
        return postEndpoints.updatePost(id, formData);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries(['posts']);
        const message = response.data?.message || 'Post updated successfully!';
        const type = response.data?.type || 'success';
        toast[type](message);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update post.');
      },
    }),

    delete: useMutation({
      mutationFn: (id) => postEndpoints.deletePost(id),
      onSuccess: (response) => {
        queryClient.invalidateQueries(['posts']);
        toast.success(response.data?.message || 'Post deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete post.');
      },
    }),

    approve: useMutation({
      mutationFn: (id) => postEndpoints.approvePost(id),
      onSuccess: (response) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['posts', 'unapproved']);
        toast.success(response.data?.message || 'Post approved successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to approve post.');
      },
    }),

    disapprove: useMutation({
      mutationFn: ({ id, reason }) => postEndpoints.disapprovePost(id, reason),
      onSuccess: (response) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['posts', 'unapproved']);
        toast.success(response.data?.message || 'Post disapproved successfully!');
        modals.closeDisapproveModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to disapprove post.');
      },
    }),
  };

  // Action handlers (rest remains unchanged)
  const handlers = {
    fetchNextPage: useCallback(
      throttle(() => {
        if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
          postsQuery.fetchNextPage();
        }
      }, 300),
      [postsQuery.hasNextPage, postsQuery.isFetchingNextPage]
    ),

    approvePost: useCallback(async (id) => {
      if (window.confirm('Are you sure you want to approve this post?')) {
        try {
          await mutations.approve.mutateAsync(id);
        } catch (error) {
          // Error handling is managed in the mutation's onError
        }
      }
    }, [mutations.approve]),

    disapprovePost: useCallback(async () => {
      const { selectedPost, disapproveReason } = modalState;
      if (!selectedPost || !disapproveReason.trim()) {
        toast.warning('Please provide a reason for disapproval.');
        return;
      }

      try {
        await mutations.disapprove.mutateAsync({
          id: selectedPost.id,
          reason: disapproveReason,
        });
      } catch (error) {
        // Error handling is managed in the mutation's onError
      }
    }, [modalState, mutations.disapprove]),
  };

  // Return object (unchanged structure with all existing functionality)
  return {
    // Query data
    posts: postsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    totalPosts: postsQuery.data?.pages[0]?.totalCount ?? 0,
    isLoading: postsQuery.isLoading,
    isFetching: postsQuery.isFetching,
    hasNextPage: postsQuery.hasNextPage,
    fetchNextPage: handlers.fetchNextPage,
    isStaffOrAdmin,
    userRoles,
    error: postsQuery.error,

    // Unapproved Posts Data
    unapprovedPosts: unapprovedPostsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    isLoadingUnapproved: unapprovedPostsQuery.isLoading,

    // Modal state and handlers
    modalState,
    modals,

    // Mutations with loading states
    createPost: mutations.create.mutateAsync,
    updatePost: mutations.update.mutateAsync,
    deletePost: mutations.delete.mutateAsync,
    approvePost: handlers.approvePost,
    disapprovePost: handlers.disapprovePost,
    isCreating: mutations.create.isLoading,
    isUpdating: mutations.update.isLoading,
    isDeleting: mutations.delete.isLoading,
    isApproving: mutations.approve.isLoading,
    isDisapproving: mutations.disapprove.isLoading,
  };
};

export default usePosts;