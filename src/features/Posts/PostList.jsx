// src/features/Posts/PostList.jsx
import React, { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import { usePosts } from './hooks/usePosts';
import PostItem from './PostItem';
import Spinner from '../../components/common/Spinner';
import styles from './PostList.module.css';
import { throttle } from 'lodash';

const PostList = ({ searchQuery, ordering, onlyMyPosts = false, isAuthenticated }) => {
  const {
    posts,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    approvePost,
    openDisapproveModal,
  } = usePosts({
    search: searchQuery,
    ordering,
    onlyMyPosts,
    isAuthenticated,
  });

  const loadMore = useCallback(
    throttle(() => {
      if (hasNextPage) {
        fetchNextPage();
      }
    }, 300),
    [hasNextPage, fetchNextPage]
  );

  if (isLoading) return <Spinner message="Loading posts..." />;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  // Define breakpoint columns for responsive design
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMore}
      hasMore={!!hasNextPage}
      loader={<Spinner message="Loading more posts..." />}
      className={styles.infiniteScroll}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isAuthenticated={isAuthenticated}
              approvePost={approvePost}
              openDisapproveModal={openDisapproveModal}
            />
          ))
        ) : (
          <div className={styles.noPosts}>No posts available</div>
        )}
      </Masonry>
    </InfiniteScroll>
  );
};

export default PostList;
