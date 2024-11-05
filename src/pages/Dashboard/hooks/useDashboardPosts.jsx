import { useQuery } from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';
import { useAuth } from '../../../features/Accounts/hooks/useAuth';

export const useDashboardPosts = () => {
  const { isAuthenticated } = useAuth();
  const POSTS_PER_PAGE = 5;
  const MINIMUM_RATING = 0.1;

  return useQuery({
    queryKey: ['dashboard-posts'],
    queryFn: async () => {
      try {
        // Only fetch if authenticated
        if (!isAuthenticated) {
          return { popularPosts: [], recentPosts: [] };
        }

        const [popularResponse, recentResponse] = await Promise.all([
          postEndpoints.getPosts({
            page: 1,
            page_size: POSTS_PER_PAGE,
            ordering: '-average_rating',
            is_approved: true,
            // Use PostSerializer instead of PostListSerializer
            detail: true
          }),
          postEndpoints.getPosts({
            page: 1,
            page_size: POSTS_PER_PAGE,
            ordering: '-created_at',
            is_approved: true,
            detail: true
          })
        ]);

        // Filter and validate popular posts
        const popularPosts = popularResponse.data.results.filter(post => {
          const rating = Number(post.average_rating) || 0;
          return rating >= MINIMUM_RATING;
        });

        return {
          popularPosts,
          recentPosts: recentResponse.data.results
        };
      } catch (error) {
        console.error('Error fetching dashboard posts:', error);
        throw error;
      }
    },
    select: (data) => {
      const transformPost = (post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        created_at: post.created_at,
        image: post.image,
        is_owner: post.is_owner,
        average_rating: Number(post.average_rating) || 0,
        total_ratings: Number(post.total_ratings) || 0,
        comments_count: Number(post.comments_count) || 0,
        ratings_count: Number(post.ratings_count) || 0,
        formattedDate: new Date(post.created_at).toLocaleDateString(),
        ratingDisplay: (Number(post.average_rating) || 0).toFixed(1),
        engagementScore: 
          Number(post.comments_count || 0) + 
          Number(post.ratings_count || 0)
      });

      return {
        popularPosts: data.popularPosts.map(transformPost),
        recentPosts: data.recentPosts.map(transformPost)
      };
    },
    enabled: isAuthenticated, // Only run query if authenticated
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 2
  });
};

export default useDashboardPosts;