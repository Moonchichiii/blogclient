import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlogModal from './BlogModal';
import { approvePost, disapprovePost } from '../../store/postSlice';
import useToast from '../../hooks/useToast';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApprove = async () => {
    try {
      await dispatch(approvePost(post.id)).unwrap();
      showToast('Post approved successfully!', 'success');
    } catch (error) {
      showToast('Failed to approve post.', 'error');
    }
  };

  const handleDisapprove = async () => {
    const reason = prompt("Please provide a reason for disapproval:");
    if (reason) {
      try {
        await dispatch(disapprovePost({ id: post.id, reason })).unwrap();
        showToast('Post disapproved successfully!', 'success');
      } catch (error) {
        showToast('Failed to disapprove post.', 'error');
      }
    } else {
      showToast('Disapproval reason is required.', 'warning');
    }
  };
  
  const isAdmin = currentUser && currentUser.is_admin;

  return (
    <article className={styles.blogCard}>
      <header className={styles.blogHeader}>
        {post.image && <img src={post.image} alt={`Image for ${post.title}`} className={styles.blogImage} />}
      </header>
      <div className={styles.blogContent}>
        <h2 className={styles.blogTitle}>{post.title}</h2>
        <p className={styles.blogExcerpt}>{post.content.substring(0, 150)}...</p>
      </div>
      <footer className={styles.blogFooter}>
        <div className={styles.postInfo}>
          <span className={styles.author}>Author: {post.author_name}</span>
          <span className={styles.rating}>
            {post.average_rating ? (
              <>
                <span role="img" aria-label="star">⭐</span>
                {post.average_rating.toFixed(1)} ({post.total_ratings} ratings)
              </>
            ) : 'No ratings yet'}
          </span>
        </div>
        <button onClick={openModal} className={styles.readMoreButton}>
          Read More
        </button>
      </footer>

      {isAdmin && (
        <div className={styles.adminActions}>
          {!post.is_approved ? (
            <button onClick={handleApprove} className={styles.adminButton}>Approve</button>
          ) : (
            <button onClick={handleDisapprove} className={styles.adminButton}>Disapprove</button>
          )}
        </div>
      )}

      {isAuthenticated && (
        <BlogModal 
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          post={post}
        />
      )}
    </article>
  );
};

export default BlogCard;