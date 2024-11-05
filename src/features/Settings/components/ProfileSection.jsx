import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { Camera, Edit2 } from 'lucide-react';
import styles from '../../../pages/Settings/Settings.module.css';

const ProfileSection = () => {
  const { user } = useAuth();
  const {
    handleProfileUpdate,
    isProfileUpdating,
  } = useSettings();

  // Initialize form data from user profile
  const [formData, setFormData] = useState({
    profile_name: user?.profile?.profile_name || '',
    bio: user?.profile?.bio || '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(user?.profile?.image?.url || null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameError, setNameError] = useState('');

  // Update form data when user data changes
  useEffect(() => {
    if (user?.profile) {
      setFormData(prev => ({
        ...prev,
        profile_name: user.profile.profile_name || '',
        bio: user.profile.bio || ''
      }));
      setImagePreview(user.profile.image?.url || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'profile_name') {
      setNameError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create FormData for image upload
      const imageFormData = new FormData();
      imageFormData.append('image', file);

      // Update form data
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      handleProfileUpdate({ image: file });
    }
  };

  const handleProfileNameSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profile_name?.trim()) {
      setNameError('Profile name cannot be empty');
      return;
    }

    try {
      await handleProfileUpdate({ profile_name: formData.profile_name });
      setIsEditingName(false);
      setNameError('');
    } catch (error) {
      setNameError(error?.response?.data?.message || 'Failed to update profile name');
    }
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    try {
      await handleProfileUpdate({ bio: formData.bio });
    } catch (error) {
      // Handle bio update error
      console.error('Failed to update bio:', error);
    }
  };

  return (
    <div className={`${styles.settingsSection} ${styles.profileSection}`}>
      <div className={styles.sectionHeader}>
        <h2>Profile Settings</h2>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                className={styles.profileImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path/to/fallback/image'; // Add a fallback image
                }}
              />
            ) : (
              <div className={styles.profileImage}>
                {formData.profile_name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <label className={styles.imageUploadLabel} htmlFor="image">
              <Camera size={20} />
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className={styles.hiddenInput}
              />
            </label>
          </div>

          <div className={styles.profileDetails}>
            {isEditingName ? (
              <form onSubmit={handleProfileNameSubmit} className={styles.formGroup}>
                <input
                  type="text"
                  name="profile_name"
                  value={formData.profile_name}
                  onChange={handleChange}
                  className={nameError ? styles.inputError : ''}
                  placeholder="Enter profile name"
                  autoFocus
                  maxLength={30}
                />
                {nameError && <div className={styles.errorMessage}>{nameError}</div>}
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNameError('');
                      setFormData(prev => ({
                        ...prev,
                        profile_name: user?.profile?.profile_name || ''
                      }));
                    }}
                    className={`${styles.button} ${styles.secondaryButton}`}
                    disabled={isProfileUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.primaryButton}`}
                    disabled={isProfileUpdating}
                  >
                    {isProfileUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileNameDisplay}>
                <h3>{formData.profile_name || 'User'}</h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className={styles.settingButton}
                  aria-label="Edit profile name"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile Name</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleBioUpdate}>
          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={isProfileUpdating}
            >
              {isProfileUpdating ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;