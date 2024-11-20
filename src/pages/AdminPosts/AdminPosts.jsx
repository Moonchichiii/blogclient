import React, { useState } from 'react';
import { usePosts } from '../../features/Posts/hooks/usePosts';
import PostList from '../../features/Posts/PostList';
import PostModal from '../../features/Posts/PostModal';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './AdminPosts.module.css';
import { toast } from 'react-toastify';

const AdminPosts = () => {
  const [activeTab, setActiveTab] = useState('unapproved');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [modalState, setModalState] = useState({
    isDisapproveOpen: false,
    selectedPost: null,
    disapproveReason: '',
  });

  const isApproved = activeTab === 'all' ? undefined : false;

  const {
    posts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    approvePost,
    disapprovePost,
  } = usePosts({
    isApproved,
    search: searchQuery,
    ordering,
  });

  const handleApprove = async (postId) => {
    if (window.confirm('Are you sure you want to approve this post?')) {
      await approvePost(postId);
    }
  };

  const handleDisapprove = (post) => {
    setModalState({
      isDisapproveOpen: true,
      selectedPost: post,
      disapproveReason: '',
    });
  };

  const handleDisapproveSubmit = async () => {
    const { selectedPost, disapproveReason } = modalState;
    if (!disapproveReason.trim()) {
      toast.warning('Please provide a reason for disapproval.');
      return;
    }
    await disapprovePost({ id: selectedPost.id, reason: disapproveReason });
    handleModalClose();
  };

  const handleModalClose = () => {
    setModalState({
      isDisapproveOpen: false,
      selectedPost: null,
      disapproveReason: '',
    });
  };

  return (
    <div className={styles.adminPostsContainer}>
      <h1 className={styles.title}>Posts Management</h1>

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
            className={`${styles.tabButton} ${
              activeTab === 'unapproved' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('unapproved')}
          >
            Pending Approval
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'all' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Posts
          </button>
        </div>

        <div className={styles.tabContent}>
        <PostList
  posts={posts}
  isLoading={isLoading}
  error={error}
  fetchNextPage={fetchNextPage}
  hasNextPage={hasNextPage}
  onApprove={handleApprove}
  onDisapprove={handleDisapprove}
  pageContext="adminPosts"
  isAuthenticated={true}
  isApproved={activeTab === 'unapproved' ? false : undefined}
  searchQuery={searchQuery}
  ordering={ordering}
/>
        </div>
      </div>

      {/* Disapprove Modal */}
      {modalState.isDisapproveOpen && (
        <PostModal
          isOpen={modalState.isDisapproveOpen}
          onClose={handleModalClose}
          postToEdit={modalState.selectedPost}
          mode="disapprove"
          reason={modalState.disapproveReason}
          onReasonChange={(e) =>
            setModalState((prev) => ({ ...prev, disapproveReason: e.target.value }))
          }
          onSubmit={handleDisapproveSubmit}
        />
      )}
    </div>
  );
};

export default AdminPosts;
