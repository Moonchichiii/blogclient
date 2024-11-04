import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  FileText,
  MessageSquare,
  Star,
  Users,
  PlusCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import PostModal from '../../features/Posts/PostModal';
import Modal from 'react-modal';
import styles from './Dashboard.module.css';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import { usePosts } from '../../features/Posts/hooks/usePosts';
import AuthModal from '../../features/Accounts/AuthModal';

Modal.setAppElement('#root');

const Dashboard = () => {
  const { user: currentUser, isLoading: isUserLoading } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  const {
    unapprovedPosts,
    isLoadingUnapproved,
    modalState,
    modals,
    handleApprovePost,
    handleDisapprovePost
  } = usePosts({
    isStaffOrAdmin: currentUser?.is_staff || currentUser?.is_superuser
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.isNewRegistration) {
      setShowTwoFactorModal(true);
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  const DisapprovalModalContent = () => (
    <>
      <button onClick={modals.closeDisapproveModal} className={styles.closeButton}>×</button>
      <h2>Disapprove Post</h2>
      {modalState.selectedPost && (
        <>
          <p>
            Are you sure you want to disapprove the post titled "
            <strong>{modalState.selectedPost.title || 'Untitled Post'}</strong>"?
          </p>
          <textarea
            value={modalState.disapproveReason}
            onChange={(e) => modals.setDisapproveReason(e.target.value)}
            placeholder="Enter reason for disapproval"
            className={styles.textarea}
            rows={4}
          />
          <div className={styles.modalActions}>
            <button
              onClick={handleDisapprovePost}
              className={`${styles.actionButton} ${styles.confirmButton}`}
            >
              Submit
            </button>
            <button
              onClick={modals.closeDisapproveModal}
              className={`${styles.actionButton} ${styles.cancelButton}`}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.navbarSpacing}></div>

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
        {/* Create Post Box - Moved to top */}
        <div className={`${styles.bentoBox} ${styles.createPostBox} ${styles.featured}`}>
          <div className={styles.createPostHeader}>
            <PlusCircle size={24} />
            <h2>Create New Post</h2>
          </div>
          <button onClick={modals.openCreateModal} className={`${styles.actionButton} ${styles.createButton}`}>
            Create Post
          </button>
        </div>

        {/* Most Popular Posts Box */}
        <div className={`${styles.bentoBox} ${styles.popularPosts}`}>
          <div className={styles.sectionHeader}>
            <TrendingUp size={24} />
            <h2>Most Popular Posts</h2>
          </div>
          <div className={styles.popularPostsList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.popularPostItem}>
                <div className={styles.popularPostInfo}>
                  <h3>Popular Post {i}</h3>
                  <p>1.2k views • 45 likes</p>
                </div>
                <Link to={`/post/${i}`} className={styles.viewLink}>
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
        

        {/* Stats Boxes */}
        {[
          { icon: FileText, title: 'My Posts', count: currentUser?.posts?.length, link: '/my-posts' },
          { icon: MessageSquare, title: 'My Comments', count: currentUser?.comments?.length, link: '/my-comments' },
          { icon: Star, title: 'My Ratings', count: currentUser?.ratings?.length, link: '/my-ratings' }
        ].map(({ icon: Icon, title, count, link }) => (
          <div key={title} className={styles.bentoBox}>
            <Icon size={24} />
            <h2>{title}</h2>
            <p>Total {title.split(' ')[1]}: {count || 0}</p>
            <Link to={link} className={styles.actionButton}>View {title.split(' ')[1]}</Link>
          </div>
        ))}

        {/* Followers Box */}
        <div className={styles.bentoBox}>
          <Users size={24} />
          <h2>Followers</h2>
          <p>Followers: {currentUser?.followers?.length || 0}</p>
          <p>Following: {currentUser?.following?.length || 0}</p>
          <Link to="/manage-followers" className={styles.actionButton}>Manage Followers</Link>
        </div>

        {/* Unapproved Posts Box */}
        {(currentUser?.is_staff || currentUser?.is_superuser) && (
          <div className={`${styles.bentoBox} ${styles.unapprovedPostsBox}`}>
            <AlertTriangle size={24} />
            <h2>Unapproved Posts</h2>
            {isLoadingUnapproved ? (
              <p>Loading unapproved posts...</p>
            ) : (
              <>
                <p>Total: {unapprovedPosts?.length || 0}</p>
                {unapprovedPosts?.length > 0 && (
                  <ul className={styles.unapprovedList}>
                    {unapprovedPosts.map((post) => (
                      <li key={post.id} className={styles.unapprovedItem}>
                        <span>{post.title || 'Untitled Post'}</span>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleApprovePost(post.id)}
                            className={`${styles.actionButton} ${styles.approveButton}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => modals.openDisapproveModal(post)}
                            className={`${styles.actionButton} ${styles.disapproveButton}`}
                          >
                            Disapprove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/unapproved-posts" className={styles.actionButton}>
                  Review Posts
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <PostModal 
        isOpen={modalState.isCreateOpen}
        onClose={modals.closeCreateModal}
      />

      <Modal
        isOpen={modalState.isDisapproveOpen}
        onRequestClose={modals.closeDisapproveModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <DisapprovalModalContent />
      </Modal>

      {showTwoFactorModal && (
        <AuthModal
          isOpen={true}
          onClose={() => setShowTwoFactorModal(false)}
          initialView="twoFactorSetup"
          disableClose={true}
          onSuccess={() => setShowTwoFactorModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;