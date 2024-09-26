import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactModal from 'react-modal';
import { fetchCurrentUser, updateUserProfile } from '../../store/userSlice';
import { setupTwoFactor, deleteAccount, updateEmail } from '../../store/authSlice';
import useToast from '../../hooks/useToast';
import styles from './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        profile_name: user.profile_name || '',
        bio: user.profile?.bio || '',
        email: user.email || '',
      });
      setImagePreview(user.profile?.image || null);
      setIs2FAEnabled(user?.is_2fa_enabled || false);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append('bio', formData.bio);
    updatedFormData.append('profile_name', formData.profile_name);
    if (imageFile) {
      updatedFormData.append('image', imageFile);
    }
    try {
      await dispatch(updateUserProfile(updatedFormData)).unwrap();
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount()).unwrap();
      showToast('Account deleted successfully!', 'success');
      setIsModalOpen(false); 
    } catch {
      showToast('Failed to delete account.', 'error');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await dispatch(setupTwoFactor()).unwrap();
      showToast('2FA setup successfully. Use the QR code to configure your app.', 'success');
      setQrCode(response.config_url);
      setIs2FAEnabled(true);
    } catch {
      showToast('Failed to set up 2FA. Please try again.', 'error');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await dispatch(updateEmail(formData.email)).unwrap();
      showToast('Email updated successfully!', 'success');
    } catch {
      showToast('Failed to update email. Please try again.', 'error');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>No user data available</div>;

  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>Your Profile</h1>
      {user?.profile?.image && (
  <img
    src={user.profile.image}
    alt={`${user.profile_name}'s profile`}
    className={styles.profileImage}
  />
)}
      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="profile_name">Profile Name:</label>
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
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Profile Image:</label>
            <input type="file" id="image" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Profile Preview" className={styles.imagePreview} />}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <button type="button" onClick={handleUpdateEmail} className={styles.button}>Update Email</button>
          </div>
          <button type="submit" className={styles.button}>Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </form>
      ) : (
        <div className={styles.info}>
          <p><strong>Profile Name:</strong> {user.profile_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.profile?.bio || 'No bio provided'}</p>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit Profile</button>
        </div>
      )}

      <div className={styles.actions}>
        <h3>Account Settings</h3>
        <button onClick={() => setIsModalOpen(true)} className={styles.button}>Delete Account</button>
        {!is2FAEnabled && (
          <button onClick={handleEnable2FA} className={styles.button}>Enable Two-Factor Authentication</button>
        )}
        {qrCode && (
          <div>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={qrCode} alt="2FA QR Code" />
          </div>
        )}
      </div>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
        ariaHideApp={false}
      >
        <h2>Are you sure?</h2>
        <p>This action cannot be undone. Do you want to proceed with deleting your account?</p>
        <div className={styles.modalActions}>
          <button onClick={handleDeleteAccount} className={styles.confirmButton}>Yes, delete my account</button>
          <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
        </div>
      </ReactModal>
    </div>
  );
};

export default Profile;
