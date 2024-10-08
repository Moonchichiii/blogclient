import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePosts } from './hooks/usePosts';
import PostItem from './PostsItem';
import { Loader } from 'lucide-react';
import styles from './PostList.module.css';
import { throttle } from 'lodash';

const PostList = ({ searchQuery, ordering }) => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, hasNextPage, fetchNextPage } = usePosts({ search: searchQuery, ordering, page });

  useEffect(() => {
    setPage(1);
  }, [searchQuery, ordering]);

  const loadMore = useCallback(throttle(() => {
    if (hasNextPage) {
      fetchNextPage();
      setPage(prev => prev + 1);
    }
  }, 300), [hasNextPage, fetchNextPage]);

  if (isLoading && page === 1) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  const posts = data?.pages?.flatMap(pageData => pageData?.results ?? []) || [];

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMore}
      hasMore={!!hasNextPage}
      loader={<Loader />}
      className={styles.postList}
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          post?.id ? <PostItem key={post.id} post={post} /> : null
        ))
      ) : (
        <div>No posts available</div>
      )}
    </InfiniteScroll>
  );
};

export default PostList;