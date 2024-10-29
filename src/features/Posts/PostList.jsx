import React, { useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePosts } from './hooks/usePosts';
import PostItem from './PostsItem';
import { Loader } from 'lucide-react';
import styles from './PostList.module.css';
import { throttle } from 'lodash';

const PostList = ({ searchQuery, ordering, onlyMyPosts = false, isAuthenticated }) => {
  const {
    posts,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = usePosts({
    search: searchQuery,
    ordering,
    onlyMyPosts,
  });

  const loadMore = useCallback(
    throttle(() => {
      if (hasNextPage) {
        fetchNextPage();
      }
    }, 300),
    [hasNextPage, fetchNextPage]
  );

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMore}
      hasMore={!!hasNextPage}
      loader={<Loader />}
      className={styles.postList}
    >
      {posts.length > 0 ? (
        posts.map((post) =>
          post?.id ? (
            <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} />
          ) : null
        )
      ) : (
        <div>No posts available</div>
      )}
    </InfiniteScroll>
  );
};

export default PostList;
