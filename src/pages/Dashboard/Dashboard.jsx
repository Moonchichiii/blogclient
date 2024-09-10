import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, FileText, MessageSquare, Star, Users, PlusCircle } from 'lucide-react';
import Modal from 'react-modal';
import PostForm from '../../components/Posts/PostForm';
import styles from './Dashboard.module.css';

Modal.setAppElement('#root'); 

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.dashboard}>
      <div className={styles.profileHeader}>
      <h1 className={styles.title}>Welcome, {user?.profile_name}</h1>
        {user?.profile?.image && (
          <img 
            src={user.profile.image} 
            alt={`${user.profile_name}'s profile`} 
            className={styles.profileImage}
          />
        )}
        
      </div>
      <div className={styles.bentoGrid}>
        <div className={styles.bentoBox}>
          <User size={24} />
          <h2>Profile</h2>
          <p>Email: {user?.email}</p>
          <p>Bio: {user?.profile?.bio}</p>
          <Link to="/profile-settings" className={styles.actionButton}>Settings</Link>
        </div>
        <div className={styles.bentoBox}>
          <FileText size={24} />
          <h2>My Posts</h2>
          <p>Total Posts: {user?.posts?.length}</p>
          <button className={styles.actionButton}>View Posts</button>
        </div>
        <div className={styles.bentoBox}>
          <MessageSquare size={24} />
          <h2>My Comments</h2>
          <p>Total Comments: {user?.comments?.length}</p>
          <button className={styles.actionButton}>View Comments</button>
        </div>
        <div className={styles.bentoBox}>
          <Star size={24} />
          <h2>My Ratings</h2>
          <p>Total Ratings: {user?.ratings?.length}</p>
          <button className={styles.actionButton}>View Ratings</button>
        </div>
        <div className={styles.bentoBox}>
          <Users size={24} />
          <h2>Followers</h2>
          <p>Followers: {user?.followers?.length}</p>
          <p>Following: {user?.following?.length}</p>
          <button className={styles.actionButton}>Manage Followers</button>
        </div>
        <div className={`${styles.bentoBox} ${styles.createPostBox}`}>
          <PlusCircle size={24} />
          <h2>Create New Post</h2>
          <button onClick={openModal} className={styles.actionButton}>Create Post</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <button onClick={closeModal} className={styles.closeButton}>×</button>
        <h2>Create a New Post</h2>
        <PostForm onPostCreated={closeModal} />
      </Modal>
    </div>
  );
};

export default Dashboard;
