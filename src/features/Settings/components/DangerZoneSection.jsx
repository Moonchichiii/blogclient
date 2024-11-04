import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { Trash2 } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import styles from '../../../pages/Settings/Settings.module.css';

const DangerZoneSection = () => {
  const { handleAccountDeletion } = useSettings();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email !== user?.email) {
      // You can use your toast system here
      console.error('Email does not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleAccountDeletion(formData);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DeleteModalContent = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2>Delete Account</h2>
      </div>
      <div className={styles.sectionContent}>
        <div className={styles.warningBox}>
          <h3 className={styles.warningTitle}>
            Warning: This action cannot be undone
          </h3>
          <p className={styles.warningText}>
            All your data will be permanently deleted, including:
          </p>
          <ul className={styles.warningList}>
            <li>Your profile and personal information</li>
            <li>All your posts and comments</li>
            <li>Your followers and following relationships</li>
            <li>All other associated data</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">
              Confirm your email address ({user?.email})
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Confirm your password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.deleteButton}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className={styles.dangerZoneSection}>
      <div className={styles.sectionHeader}>
        <h2>Danger Zone</h2>
      </div>
      <div className={styles.sectionContent}>
        <p className={styles.warningText}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          onClick={() => setShowModal(true)} 
          className={styles.deleteButton}
        >
          <Trash2 size={20} />
          <span>Delete Account</span>
        </button>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
      >
        <DeleteModalContent />
      </Modal>
    </div>
  );
};

export default DangerZoneSection;