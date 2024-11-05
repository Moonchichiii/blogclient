import React, { useState } from 'react';
import PostList from '../../features/Posts/PostList';
import SearchBar from '../../components/SearchBar/SearchBar';
import PostModal from '../../features/Posts/PostModal';
import styles from './Blog.module.css';
import { useAuth } from '../../features/Accounts/hooks/useAuth';

const Blog = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);

  const handleOpenPostModal = (post = null) => {
    setPostToEdit(post);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setPostToEdit(null);
    setIsPostModalOpen(false);
  };

  return (
    <div className={styles.blogContainer}>
      <h2 className={styles.title}>Blog Posts</h2>

      <div className={styles.controls}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          placeholder="Search posts..."
          className={styles.searchBar}
        />

        <select
          onChange={(e) => setOrdering(e.target.value)}
          value={ordering}
          className={styles.orderingSelect}
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-average_rating">Highest Rated</option>
          <option value="-total_ratings">Most Rated</option>
          <option value="-comments_count">Most Commented</option>
        </select>
      </div>

      <PostList
        searchQuery={searchQuery}
        ordering={ordering}
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated && (
        <button
          onClick={() => handleOpenPostModal()}
          className={styles.createPostButton}
        >
          Create New Post
        </button>
      )}

      <PostModal
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        postToEdit={postToEdit}
      />
    </div>
  );
};

export default Blog;