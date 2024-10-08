import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followerEndpoints, profileEndpoints } from '../api/endpoints';

export const useFollowers = (userId) => {
  const queryClient = useQueryClient();

  const followersQuery = useQuery(
    ['followers', userId],
    () => followerEndpoints.getFollowers(userId),
    { enabled: !!userId }
  );

  const popularFollowersQuery = useQuery(
    ['popularFollowers', userId],
    () => profileEndpoints.getPopularFollowers(userId),
    { enabled: !!userId }
  );

  const followMutation = useMutation(
    (followedId) => followerEndpoints.followUser(followedId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['followers', userId]);
        queryClient.invalidateQueries(['popularFollowers', userId]);
      },
    }
  );

  const unfollowMutation = useMutation(
    (followedId) => followerEndpoints.unfollowUser(followedId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['followers', userId]);
        queryClient.invalidateQueries(['popularFollowers', userId]);
      },
    }
  );

  return {
    followers: followersQuery.data,
    isLoadingFollowers: followersQuery.isLoading,
    followersError: followersQuery.error,
    popularFollowers: popularFollowersQuery.data,
    isLoadingPopularFollowers: popularFollowersQuery.isLoading,
    popularFollowersError: popularFollowersQuery.error,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isLoading,
    isUnfollowing: unfollowMutation.isLoading,
  };
};