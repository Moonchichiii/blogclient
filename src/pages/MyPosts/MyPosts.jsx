import React, { useState } from 'react';
import { usePosts } from '../../features/Posts/hooks/usePosts';
import PostList from '../../features/Posts/PostList';
import PostModal from '../../features/Posts/PostModal';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './MyPosts.module.css';

const MyPosts = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedPost: null,
  });

  const isApproved = activeTab === 'published';

  const {
    posts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    deletePost,
    updatePost,
    createPost,
  } = usePosts({
    onlyMyPosts: true,
    isApproved,
    search: searchQuery,
    ordering,
  });

  const handleEdit = (post) => {
    setModalState({ isOpen: true, selectedPost: post });
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, selectedPost: null });
  };

  const handleCreateOrUpdate = async (postData) => {
    if (modalState.selectedPost) {
      await updatePost({ id: modalState.selectedPost.id, postData });
    } else {
      await createPost(postData);
    }
    handleModalClose();
  };

  return (
    <div className={styles.myPostsContainer}>
      <h1 className={styles.title}>My Posts</h1>
      
      <div className={styles.controls}>
        <SearchBar setSearchQuery={setSearchQuery} />
        <select
          onChange={(e) => setOrdering(e.target.value)}
          value={ordering}
          className={styles.orderingSelect}
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
        </select>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tabButton} ${activeTab === 'published' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published Posts
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval
          </button>
        </div>

        <div className={styles.tabContent}>
        <PostList
  posts={posts}
  isLoading={isLoading}
  error={error}
  fetchNextPage={fetchNextPage}
  hasNextPage={hasNextPage}
  onDelete={handleDelete}
  onEdit={handleEdit}
  pageContext="myPosts"
  isAuthenticated={true}
  isApproved={activeTab === 'published'}
  onlyMyPosts={true}
  searchQuery={searchQuery}
  ordering={ordering}
/>

        </div>
      </div>

      <PostModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateOrUpdate}
        postToEdit={modalState.selectedPost}
      />
    </div>
  );
};

export default MyPosts;
