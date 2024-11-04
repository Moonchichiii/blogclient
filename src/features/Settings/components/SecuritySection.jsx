import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { Lock, Mail, Shield } from 'lucide-react';
import Modal from '../../../components/Modal/Modal';
import TwoFactorSetup from '../../Accounts/TwoFactorSetup';
import styles from '../../../pages/Settings/Settings.module.css';

const SecuritySection = () => {
  const {
    handlePasswordReset,
    handleEmailUpdate,
    handleSetupTwoFactor,
    handleDisableTwoFactor,
    isPasswordResetting,
    isEmailUpdating,
    isTwoFactorSetting,
  } = useSettings();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [error, setError] = useState('');

  const closeModal = () => {
    setActiveModal(null);
    setError('');
  };

  const PasswordResetContent = () => {
    const [formData, setFormData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        await handlePasswordReset(formData);
        closeModal();
      } catch (err) {
        setError(err.message || 'Failed to update password');
      }
    };

    return (
      <>
        <div className={styles.sectionHeader}>
          <h2>Change Password</h2>
        </div>
        <div className={styles.sectionContent}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={closeModal}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isPasswordResetting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.primaryButton}`}
                disabled={isPasswordResetting}
              >
                {isPasswordResetting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  const EmailUpdateContent = () => {
    const [formData, setFormData] = useState({
      newEmail: '',
      password: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await handleEmailUpdate(formData);
        closeModal();
      } catch (err) {
        setError(err.message || 'Failed to update email');
      }
    };

    return (
      <>
        <div className={styles.sectionHeader}>
          <h2>Update Email</h2>
        </div>
        <div className={styles.sectionContent}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <p className={styles.currentEmail}>
            Current email: <strong>{user?.email}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="newEmail">New Email Address</label>
              <input
                id="newEmail"
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Confirm Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={closeModal}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isEmailUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.primaryButton}`}
                disabled={isEmailUpdating}
              >
                {isEmailUpdating ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  const TwoFactorContent = () => {
    const hasTwoFactor = user?.has_two_factor;
    const [confirmDisable, setConfirmDisable] = useState(false);

    const handleDisable = async () => {
      try {
        await handleDisableTwoFactor();
        closeModal();
      } catch (err) {
        setError(err.message || 'Failed to disable 2FA');
      }
    };

    if (hasTwoFactor && !confirmDisable) {
      return (
        <>
          <div className={styles.sectionHeader}>
            <h2>Two-Factor Authentication</h2>
          </div>
          <div className={styles.confirmationStep}>
            <p>Are you sure you want to disable two-factor authentication?</p>
            <p className={styles.warningText}>
              This will make your account less secure.
            </p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.buttonGroup}>
              <button
                onClick={closeModal}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isTwoFactorSetting}
              >
                Cancel
              </button>
              <button
                onClick={handleDisable}
                className={`${styles.button} ${styles.dangerButton}`}
                disabled={isTwoFactorSetting}
              >
                {isTwoFactorSetting ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className={styles.sectionHeader}>
          <h2>Two-Factor Authentication</h2>
        </div>
        <div className={styles.sectionContent}>
          <TwoFactorSetup
            onSuccess={closeModal}
            onSkip={closeModal}
            onError={setError}
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.securitySection}>
      <div className={styles.sectionHeader}>
        <h2>Security</h2>
      </div>
      <div className={styles.sectionContent}>
        <button
          onClick={() => setActiveModal('password')}
          className={styles.settingButton}
        >
          <Shield size={20} />
          <span>Change Password</span>
        </button>
        <button
          onClick={() => setActiveModal('email')}
          className={styles.settingButton}
        >
          <Mail size={20} />
          <span>Update Email</span>
        </button>
        <button
          onClick={() => setActiveModal('2fa')}
          className={styles.settingButton}
        >
          <Lock size={20} />
          <span>
            {user?.has_two_factor ? 'Manage' : 'Enable'} Two-Factor Authentication
          </span>
        </button>
      </div>

      <Modal isOpen={activeModal !== null} onClose={closeModal}>
        {activeModal === 'password' && <PasswordResetContent />}
        {activeModal === 'email' && <EmailUpdateContent />}
        {activeModal === '2fa' && <TwoFactorContent />}
      </Modal>
    </div>
  );
};

export default SecuritySection;