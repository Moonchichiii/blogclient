import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import { usePosts } from './hooks/usePosts';
import PostItem from './PostItem';
import PostModal from './PostModal';
import Spinner from '../../components/common/Spinner';
import styles from './PostList.module.css';

const BREAKPOINT_COLUMNS = {
  default: 3,
  1100: 2,
  700: 1,
};

const PostList = ({
  searchQuery,
  ordering,
  onlyMyPosts = false,
  isApproved,
  showApprovalActions = false,
  posts: providedPosts,
  isAuthenticated
}) => {
  const {
    posts: fetchedPosts,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    approvePost,
    disapprovePost, // Add this to fix handleDisapprove reference
    deletePost,
    updatePost,
    modalState,
    modals,
    createPost,
  } = usePosts({
    search: searchQuery,
    ordering,
    onlyMyPosts,
    isApproved,
  });

  // Use provided posts if available, otherwise use fetched posts
  const posts = providedPosts || fetchedPosts;

  if (isLoading) return <Spinner message="Loading posts..." />;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<Spinner message="Loading more posts..." />}
        className={styles.infiniteScroll}
      >
        <Masonry
          breakpointCols={BREAKPOINT_COLUMNS}
          className={styles.myMasonryGrid}
          columnClassName={styles.myMasonryGridColumn}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                isAuthenticated={isAuthenticated}
                onApprove={showApprovalActions ? approvePost : undefined}
                onDisapprove={showApprovalActions ? disapprovePost : undefined}
                onEdit={() => {
                  modals.openCreateModal();
                  modals.setSelectedPost(post);
                }}
                onDelete={deletePost}
                showApprovalActions={showApprovalActions}
                isMyPosts={onlyMyPosts}
              />
            ))
          ) : (
            <div className={styles.noPosts}>
              {onlyMyPosts 
                ? isApproved 
                  ? "You don't have any published posts yet."
                  : "You don't have any pending posts."
                : "No posts available"
              }
            </div>
          )}
        </Masonry>
      </InfiniteScroll>

      <PostModal
        isOpen={modalState.isCreateOpen}
        onClose={modals.closeCreateModal}
        onSubmit={modalState.selectedPost ? updatePost : createPost}
        postToEdit={modalState.selectedPost}
      />
    </>
  );
};

export default PostList;