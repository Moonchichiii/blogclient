import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  FileText,
  Star,
  Users,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import PostModal from '../../features/Posts/PostModal';
import Modal from 'react-modal';
import styles from './Dashboard.module.css';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import { usePosts } from '../../features/Posts/hooks/usePosts';
import AuthModal from '../../features/Accounts/AuthModal';
import DashboardPopularPosts from './components/DashboardPopularPosts';

Modal.setAppElement('#root');

const Dashboard = () => {
  const { 
    user: currentUser, 
    isLoading: isUserLoading, 
    hasAnyRole 
  } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  const profile = currentUser?.profile || {};
  const account = currentUser?.account || {};

  const isAdminUser = hasAnyRole(['admin', 'superuser', 'staff']);

  const userData = {
    ...currentUser,
    profile_name: profile.profile_name,
    followers: { length: profile.follower_count || 0 },
    following: { length: profile.following_count || 0 },
    posts: { length: currentUser?.posts?.length || 0 },
    ratings: { length: currentUser?.ratings?.length || 0 },
  };

  const { unapprovedPosts, isLoadingUnapproved, modalState, modals } = usePosts({
    isStaffOrAdmin: isAdminUser,
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
            <button onClick={handleDisapprovePost} className={`${styles.actionButton} ${styles.confirmButton}`}>Submit</button>
            <button onClick={modals.closeDisapproveModal} className={`${styles.actionButton} ${styles.cancelButton}`}>Cancel</button>
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
              <h1 className={styles.title}>Welcome, {userData.profile_name}</h1>
              {profile.image?.url && (
                <img
                  src={profile.image.url}
                  alt={`${userData.profile_name}'s profile`}
                  className={styles.profileImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'src/assets/images/fallback-avatar.webp';
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

      <div className={styles.bentoGrid}>
        <div className={`${styles.bentoBox} ${styles.featured}`}>
          <div className={styles.createPostHeader}>
            <PlusCircle size={24} />
            <h2>Create New Post</h2>
          </div>
          <button onClick={modals.openCreateModal} className={`${styles.actionButton} ${styles.createButton}`}>
            Create Post
          </button>
        </div>

        <div className={styles.bentoBox}>
          <User size={24} />
          <h2>Account Stats</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <label>Popularity</label>
              <span>{profile.popularity_score?.toFixed(1) || '0.0'}</span>
            </div>
            <div className={styles.statItem}>
              <label>Status</label>
              <span>{account.is_verified ? 'Verified' : 'Unverified'}</span>
            </div>
            <div className={styles.statItem}>
              <label>Security</label>
              <span>{account.has_2fa ? '2FA Enabled' : '2FA Disabled'}</span>
            </div>
          </div>
        </div>

        <DashboardPopularPosts />

        {[
          { icon: FileText, title: 'My Posts', count: userData.posts.length, link: '/my-posts' },
          { icon: Star, title: 'My Ratings', count: userData.ratings.length, link: '/my-ratings' },
        ].map(({ icon: Icon, title, count, link }) => (
          <div key={title} className={styles.bentoBox}>
            <Icon size={24} />
            <h2>{title}</h2>
            <p>Total {title.split(' ')[1]}: {count || 0}</p>
            <Link to={link} className={styles.actionButton}>View {title.split(' ')[1]}</Link>
          </div>
        ))}

        <div className={styles.bentoBox}>
          <Users size={24} />
          <h2>Network</h2>
          <div className={styles.followStats}>
            <p>Followers: {userData.followers.length}</p>
            <p>Following: {userData.following.length}</p>
          </div>
          <Link to="/followers" className={styles.actionButton}>Manage Network</Link>
        </div>        

        {isAdminUser && (
          <div className={styles.bentoBox}>                      
            <AlertTriangle size={24} />
            <h2>Admin Posts Management</h2>
            <div className={styles.adminContent}>
              <div className={styles.adminStats}>
                <div className={styles.statItem}>
                  <label>Pending Approval</label>
                  <span>{isLoadingUnapproved ? (
                    <span className={styles.loading}>Loading...</span>
                  ) : (
                    unapprovedPosts?.length || 0
                  )}</span>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <Link to="/admin/posts" className={styles.actionButton}>
                  Manage All Posts
                </Link>
                {unapprovedPosts?.length > 0 && (
                  <Link to="/admin/posts?tab=unapproved" className={styles.actionButton}>
                    Review Pending ({unapprovedPosts.length})
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PostModal isOpen={modalState.isCreateOpen} onClose={modals.closeCreateModal} />

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