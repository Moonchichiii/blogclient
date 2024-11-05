import React, { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePosts } from './hooks/usePosts';
import PostItem from './PostsItem';
import { Loader } from 'lucide-react';
import styles from './PostList.module.css';
import Masonry from 'react-masonry-css';
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

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (isLoading) return <div className={styles.loader}><Loader /></div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMore}
      hasMore={!!hasNextPage}
      loader={<div className={styles.loader}><Loader /></div>}
      endMessage={<p className={styles.noPosts}>No more posts</p>}
      className={styles.infiniteScroll}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {posts.length > 0 ? (
          posts.map((post) =>
            post?.id ? (
              <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} />
            ) : null
          )
        ) : (
          <div className={styles.noPosts}>No posts available</div>
        )}
      </Masonry>
    </InfiniteScroll>
  );
};

export default PostList;