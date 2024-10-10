import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FileText,
  MessageSquare,
  Star,
  Users,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import Modal from 'react-modal';
import PostForm from '../../features/Posts/PostForm';
import styles from './Dashboard.module.css';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { postEndpoints } from '../../api/endpoints';
import { toast } from 'react-toastify';
import { usePosts } from '../../features/Posts/hooks/usePosts';

Modal.setAppElement('#root');

const Dashboard = () => {
  const { user: currentUser, isLoading: isUserLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [disapproveReason, setDisapproveReason] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handlers for opening and closing modals
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDisapproveModal = (post) => {
    setSelectedPost(post);
    setIsDisapproveModalOpen(true);
  };
  const closeDisapproveModal = () => {
    setSelectedPost(null);
    setDisapproveReason('');
    setIsDisapproveModalOpen(false);
  };

  // Handle window resize to update windowWidth state
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch unapproved posts for staff/superusers
  const {
    data: unapprovedPosts,
    isLoading: isUnapprovedLoading,
  } = useQuery({
    queryKey: ['unapprovedPosts'],
    queryFn: postEndpoints.getUnapprovedPosts,
    enabled: currentUser?.is_staff || currentUser?.is_superuser,
    onError: (error) => {
      toast.error('Failed to fetch unapproved posts.');
      console.error('Error fetching unapproved posts:', error);
    },
  });

  // Get mutations from usePosts
  const { approvePost, disapprovePost } = usePosts();

  // Handlers for approving and disapproving posts
  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this post?')) {
      try {
        await approvePost(id);
        toast.success('Post approved successfully!');
      } catch (error) {
        toast.error('Failed to approve the post.');
      }
    }
  };

  const handleDisapprove = async () => {
    if (selectedPost && disapproveReason.trim() !== '') {
      try {
        await disapprovePost({ id: selectedPost.id, reason: disapproveReason });
        toast.success('Post disapproved successfully!');
        closeDisapproveModal();
      } catch (error) {
        toast.error('Failed to disapprove the post.');
      }
    } else {
      toast.warning('Please provide a reason for disapproval.');
    }
  };

  return (
    <div className={styles.dashboard}>
      <div id="top"></div>

      {/* Conditionally render profile header on mobile */}
      {windowWidth <= 768 && (
        <div className={styles.profileHeader}>
          {isUserLoading ? (
            <p>Loading user data...</p>
          ) : (
            <>
              <h1 className={styles.title}>
                Welcome, {currentUser?.profile_name}
              </h1>
              {currentUser?.profile?.image && (
                <img
                  src={currentUser.profile.image}
                  alt={`${currentUser.profile_name}'s profile`}
                  className={styles.profileImage}
                />
              )}
            </>
          )}
        </div>
      )}

      <div className={styles.bentoGrid}>
        {/* Profile Box - Display only on mobile */}
        {windowWidth <= 768 && (
          <div className={styles.bentoBox}>
            <User size={24} />
            <h2>Profile</h2>
            <p>Email: {currentUser?.email}</p>
            <p>Bio: {currentUser?.profile?.bio}</p>
            <Link to="/profile-settings" className={styles.actionButton}>
              Settings
            </Link>
          </div>
        )}

        {/* My Posts Box */}
        <div className={styles.bentoBox}>
          <FileText size={24} />
          <h2>My Posts</h2>
          <p>Total Posts: {currentUser?.posts?.length || 0}</p>
          <Link to="/my-posts" className={styles.actionButton}>
            View Posts
          </Link>
        </div>

        {/* My Comments Box */}
        <div className={styles.bentoBox}>
          <MessageSquare size={24} />
          <h2>My Comments</h2>
          <p>Total Comments: {currentUser?.comments?.length || 0}</p>
          <Link to="/my-comments" className={styles.actionButton}>
            View Comments
          </Link>
        </div>

        {/* My Ratings Box */}
        <div className={styles.bentoBox}>
          <Star size={24} />
          <h2>My Ratings</h2>
          <p>Total Ratings: {currentUser?.ratings?.length || 0}</p>
          <Link to="/my-ratings" className={styles.actionButton}>
            View Ratings
          </Link>
        </div>

        {/* Followers Box */}
        <div className={styles.bentoBox}>
          <Users size={24} />
          <h2>Followers</h2>
          <p>Followers: {currentUser?.followers?.length || 0}</p>
          <p>Following: {currentUser?.following?.length || 0}</p>
          <Link to="/manage-followers" className={styles.actionButton}>
            Manage Followers
          </Link>
        </div>

        {/* Create Post Box */}
        <div className={`${styles.bentoBox} ${styles.createPostBox}`}>
          <PlusCircle size={24} />
          <h2>Create New Post</h2>
          <button onClick={openModal} className={styles.actionButton}>
            Create Post
          </button>
        </div>

        {/* Unapproved Posts Box (Visible to Staff/Superusers) */}
        {(currentUser?.is_staff || currentUser?.is_superuser) && (
          <div
            className={`${styles.bentoBox} ${styles.unapprovedPostsBox}`}
          >
            <AlertTriangle size={24} />
            <h2>Unapproved Posts</h2>
            {isUnapprovedLoading ? (
              <p>Loading unapproved posts...</p>
            ) : (
              <>
                <p>Total: {unapprovedPosts?.length || 0}</p>
                {unapprovedPosts && unapprovedPosts.length > 0 ? (
                  <ul className={styles.unapprovedList}>
                    {unapprovedPosts.map((post) => (
                      <li key={post.id} className={styles.unapprovedItem}>
                        <span>{post.title || 'Untitled Post'}</span>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleApprove(post.id)}
                            className={`${styles.actionButton} ${styles.approveButton}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openDisapproveModal(post)}
                            className={`${styles.actionButton} ${styles.disapproveButton}`}
                          >
                            Disapprove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No unapproved posts at the moment.</p>
                )}
                {/* Optional: Link to a dedicated review page */}
                <Link to="/unapproved-posts" className={styles.actionButton}>
                  Review Posts
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal for Creating a New Post */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button onClick={closeModal} className={styles.closeButton}>
          ×
        </button>
        <h2>Create a New Post</h2>
        <PostForm onPostCreated={closeModal} />
      </Modal>

      {/* Modal for Disapproving a Post */}
      <Modal
        isOpen={isDisapproveModalOpen}
        onRequestClose={closeDisapproveModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button onClick={closeDisapproveModal} className={styles.closeButton}>
          ×
        </button>
        <h2>Disapprove Post</h2>
        {selectedPost && (
          <>
            <p>
              Are you sure you want to disapprove the post titled "
              <strong>{selectedPost.title || 'Untitled Post'}</strong>"?
            </p>
            <textarea
              value={disapproveReason}
              onChange={(e) => setDisapproveReason(e.target.value)}
              placeholder="Enter reason for disapproval"
              className={styles.textarea}
              rows={4}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleDisapprove}
                className={`${styles.actionButton} ${styles.confirmButton}`}
              >
                Submit
              </button>
              <button
                onClick={closeDisapproveModal}
                className={`${styles.actionButton} ${styles.cancelButton}`}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
