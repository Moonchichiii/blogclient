import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followerEndpoints, userEndpoints } from '../../../api/endpoints';
import { toast } from 'react-toastify';

export const useFollowers = (userId) => {
  const queryClient = useQueryClient();

  const followersQuery = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => followerEndpoints.getFollowers(userId),
    enabled: !!userId,
    staleTime: 60000,  // Cache followers for 1 minute
    select: (response) => response.data,
    onError: () => toast.error('Failed to load followers'),
  });

  const popularFollowersQuery = useQuery({
    queryKey: ['popularFollowers', userId],
    queryFn: () => userEndpoints.getPopularFollowers(userId),
    enabled: !!userId,
    staleTime: 60000, // Cache popular followers for 1 minute
    select: (response) => response.data,
    onError: () => toast.error('Failed to load popular followers'),
  });

  const followMutation = useMutation({
    mutationFn: (followedId) => followerEndpoints.followUser(followedId),
    onSuccess: () => {
      queryClient.invalidateQueries(['followers', userId]);
      queryClient.invalidateQueries(['popularFollowers', userId]);
      toast.success('Successfully followed user');
    },
    onError: () => toast.error('Failed to follow user'),
  });

  const unfollowMutation = useMutation({
    mutationFn: (followedId) => followerEndpoints.unfollowUser(followedId),
    onSuccess: () => {
      queryClient.invalidateQueries(['followers', userId]);
      queryClient.invalidateQueries(['popularFollowers', userId]);
      toast.success('Successfully unfollowed user');
    },
    onError: () => toast.error('Failed to unfollow user'),
  });

  return {
    followers: followersQuery.data,
    isLoadingFollowers: followersQuery.isLoading,
    followersError: followersQuery.error,
    popularFollowers: popularFollowersQuery.data,
    isLoadingPopularFollowers: popularFollowersQuery.isLoading,
    popularFollowersError: popularFollowersQuery.error,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
  };
};

export default useFollowers;
