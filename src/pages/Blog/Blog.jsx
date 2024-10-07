import React, { useState } from 'react';
import PostList from '../../features/Posts/PostList';
import SearchBar from '../../components/Searchbar/SearchBar';
import PostModal from '../../features/Posts/PostModal';
import styles from './Blog.module.css';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null); 

  const handleOpenPostModal = (post = null) => {
    setPostToEdit(post);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  return (
    <div className={styles.blogContainer}>
      <h2 className={styles.title}>Blog Posts</h2>
      <SearchBar setSearchQuery={setSearchQuery} />
      <select onChange={(e) => setOrdering(e.target.value)} value={ordering} className={styles.orderingSelect}>
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="-average_rating">Highest Rated</option>
      </select>
      <PostList searchQuery={searchQuery} ordering={ordering} />

      <div>
        <button onClick={() => handleOpenPostModal()}>Create New Post</button>
        <button onClick={() => handleOpenPostModal(existingPost)}>Edit Post</button>

        <PostModal
          isOpen={isPostModalOpen}
          onClose={handleClosePostModal}
          postToEdit={postToEdit}
        />
      </div>
    </div>
  );
};

export default Blog;
