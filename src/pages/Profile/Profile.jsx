import React from 'react';
import { useProfile } from '../../features/Profile/ProfileSettings'; // Correct import path
import styles from './Profile.module.css';

const Profile = () => {
  const {
    user,
    formData,
    imagePreview,
    loading,
    error,
    handleImageChange,
    handleChange,
    handleSubmit,
  } = useProfile();

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileSettings}>
      <h1>Profile Settings</h1>
      {imagePreview && (
        <img src={imagePreview} alt="Profile Preview" className={styles.profileImage} />
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="profile_name">Profile Name</label>
          <input
            type="text"
            id="profile_name"
            name="profile_name"
            value={formData.profile_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Profile Image</label>
          <input 
            type="file" 
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className={styles.saveButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
