import React from 'react';
import ProfileSettings from '../../features/Profile/ProfileSettings';
import styles from './Profile.module.css';

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      <ProfileSettings />
    </div>
  );
};

export default Profile;