import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { Camera } from 'lucide-react';
import styles from '../../../pages/Settings/Settings.module.css';

const ProfileSection = () => {
  const {
    formData,
    imagePreview,
    handleChange,
    handleImageChange,
    handleProfileUpdate,
    isProfileUpdating,
  } = useSettings();

  return (
    <div className={styles.profileSection}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder}>
              {formData?.profile_name?.[0]?.toUpperCase() || 'Profile'}
            </div>
          )}
          <label className={styles.imageUploadLabel} htmlFor="image">
            <Camera size={20} />
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className={styles.hiddenInput}
          />
        </div>
        <h2>{formData?.profile_name || 'User'}</h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProfileUpdate(formData);
        }}
        className={styles.profileForm}
      >
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData?.bio || ''}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
          />
        </div>
        <button type="submit" className={styles.saveButton} disabled={isProfileUpdating}>
          {isProfileUpdating ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSection;
