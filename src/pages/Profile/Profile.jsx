import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, updateUserProfile } from '../../store/userSlice';
import styles from './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        profile_name: user.profile_name || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateUserProfile(formData));
    setIsEditing(false);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>No user data available</div>;

  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>Your Profile</h1>
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
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.button}>Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)} className={styles.button}>Cancel</button>
        </form>
      ) : (
        <div className={styles.info}>
          <p><strong>Profile Name:</strong> {user.profile_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.profile?.bio || 'No bio provided'}</p>
          <p><strong>Location:</strong> {user.profile?.location || 'No location provided'}</p>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;