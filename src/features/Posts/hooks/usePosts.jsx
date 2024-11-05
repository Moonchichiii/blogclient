// src/features/Posts/hooks/usePosts.jsx
import { useState, useCallback } from 'react';
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { useComments } from '../../Comments/hooks/useComments';
import { useRatings } from '../../Ratings/hooks/useRatings';
import { useTags } from '../../Tags/hooks/useTags';

// Constants for better maintainability
const POSTS_PER_PAGE = 5;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// Query key factory for dynamic keys
const QUERY_KEYS = {
  posts: (params) => ['posts', params],
  unapprovedPosts: ['unapprovedPosts'],
  previews: ['previews'],
};

export const usePosts = (params = {}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, roles, currentUser } = useAuth();
  const isStaffOrAdmin =
    isAuthenticated && (roles.includes('admin') || roles.includes('superuser'));

  // Modal State Management
  const [modalState, setModalState] = useState({
    isCreateOpen: false,
    isDisapproveOpen: false,
    selectedPost: null,
    disapproveReason: '',
  });

  // Enhanced Modal Handlers with useCallback
  const modals = {
    openCreateModal: useCallback(() =>
      setModalState((prev) => ({ ...prev, isCreateOpen: true })), []),

    closeCreateModal: useCallback(() =>
      setModalState((prev) => ({
        ...prev,
        isCreateOpen: false,
        selectedPost: null
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

  // Enhanced Posts Query with caching and dynamic query keys
  const postsQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.posts(params),
    queryFn: async ({ pageParam = 1 }) => {
      // Select appropriate endpoint based on params
      const endpoint = params.onlyMyPosts
        ? postEndpoints.getUserPosts
        : params.preview
        ? postEndpoints.getPostPreviews
        : postEndpoints.getPosts;

      const response = await endpoint({
        ...params,
        page: pageParam,
        page_size: POSTS_PER_PAGE,
      });

      return {
        results: response.data.results,
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

  // Enhanced Unapproved Posts Query retained
  const unapprovedPostsQuery = useInfiniteQuery({
    queryKey: QUERY_KEYS.unapprovedPosts,
    queryFn: () => postEndpoints.getUnapprovedPosts().then((res) => res.data),
    enabled: isStaffOrAdmin,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to fetch unapproved posts.';
      toast.error(message);
    },
  });

  // Enhanced Mutations with Optimistic Updates
  const mutations = {
    create: useMutation({
      mutationFn: (postData) => postEndpoints.createPost(postData),
      onMutate: async (newPost) => {
        await queryClient.cancelQueries(QUERY_KEYS.posts(params));
        const previousPosts = queryClient.getQueryData(QUERY_KEYS.posts(params));

        // Optimistically update posts list
        if (previousPosts?.pages) {
          queryClient.setQueryData(QUERY_KEYS.posts(params), {
            pages: [
              {
                results: [newPost, ...previousPosts.pages[0].results],
                nextPage: previousPosts.pages[0].nextPage
              },
              ...previousPosts.pages.slice(1),
            ],
          });
        }

        return { previousPosts };
      },
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.posts(params));
        toast.success('Post created successfully!');
        modals.closeCreateModal();
      },
      onError: (error, _, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(QUERY_KEYS.posts(params), context.previousPosts);
        }
        toast.error(error.response?.data?.message || 'Failed to create post.');
      },
    }),

    update: useMutation({
      mutationFn: ({ id, postData }) => postEndpoints.updatePost(id, postData),
      onMutate: async ({ id, postData }) => {
        await queryClient.cancelQueries(QUERY_KEYS.posts(params));
        const previousPosts = queryClient.getQueryData(QUERY_KEYS.posts(params));

        // Optimistically update the modified post
        if (previousPosts?.pages) {
          const updatedPages = previousPosts.pages.map(page => ({
            ...page,
            results: page.results.map(post =>
              post.id === id ? { ...post, ...postData } : post
            ),
          }));

          queryClient.setQueryData(QUERY_KEYS.posts(params), {
            ...previousPosts,
            pages: updatedPages,
          });
        }

        return { previousPosts };
      },
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.posts(params));
        toast.success('Post updated successfully!');
      },
      onError: (error, _, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(QUERY_KEYS.posts(params), context.previousPosts);
        }
        toast.error(error.response?.data?.message || 'Failed to update post.');
      },
    }),

    delete: useMutation({
      mutationFn: (id) => postEndpoints.deletePost(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries(QUERY_KEYS.posts(params));
        const previousPosts = queryClient.getQueryData(QUERY_KEYS.posts(params));

        // Optimistically remove the deleted post
        if (previousPosts?.pages) {
          const updatedPages = previousPosts.pages.map(page => ({
            ...page,
            results: page.results.filter(post => post.id !== id),
          }));

          queryClient.setQueryData(QUERY_KEYS.posts(params), {
            ...previousPosts,
            pages: updatedPages,
          });
        }

        return { previousPosts };
      },
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.posts(params));
        toast.success('Post deleted successfully!');
      },
      onError: (error, _, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(QUERY_KEYS.posts(params), context.previousPosts);
        }
        toast.error(error.response?.data?.message || 'Failed to delete post.');
      },
    }),

    approve: useMutation({
      mutationFn: (id) => postEndpoints.approvePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.posts(params));
        queryClient.invalidateQueries(QUERY_KEYS.unapprovedPosts);
        toast.success('Post approved successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to approve post.');
      },
    }),

    disapprove: useMutation({
      mutationFn: ({ id, reason }) => postEndpoints.disapprovePost(id, reason),
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.posts(params));
        queryClient.invalidateQueries(QUERY_KEYS.unapprovedPosts);
        toast.success('Post disapproved successfully!');
        modals.closeDisapproveModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to disapprove post.');
      },
    }),
  };

  // Action Handlers
  const handlers = {
    approvePost: useCallback(async (id) => {
      if (window.confirm('Are you sure you want to approve this post?')) {
        try {
          await mutations.approve.mutateAsync(id);
        } catch (error) {
          // Error handling is managed in the mutation's onError
        }
      }
    }, [mutations.approve]),

    openDisapproveModal: useCallback((post) => {
      modals.openDisapproveModal(post);
    }, [modals.openDisapproveModal]),

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

  return {
    // Query Results
    posts: postsQuery.data?.pages.flatMap((page) => page.results) || [],
    totalPosts: postsQuery.data?.pages[0]?.totalCount || 0,
    isLoading: postsQuery.isLoading,
    isFetching: postsQuery.isFetching,
    hasNextPage: postsQuery.hasNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
    error: postsQuery.error,

    // Unapproved Posts Data
    unapprovedPosts: unapprovedPostsQuery.data || [],
    isLoadingUnapproved: unapprovedPostsQuery.isLoading,

    // Modal Management
    modalState,
    modals,

    // Post Actions
    ...handlers,

    // Mutations with Loading States
    createPost: mutations.create.mutateAsync,
    updatePost: mutations.update.mutateAsync,
    deletePost: mutations.delete.mutateAsync,
    isCreating: mutations.create.isLoading,
    isUpdating: mutations.update.isLoading,
    isDeleting: mutations.delete.isLoading,
    isApproving: mutations.approve.isLoading,
    isDisapproving: mutations.disapprove.isLoading,

    // Hook Integrations (if necessary)
    comments: useComments(),
    ratings: useRatings(),
    tags: useTags(),
  };
};

export default usePosts;
