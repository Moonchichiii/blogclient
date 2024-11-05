import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { authEndpoints } from '../../api/endpoints';
import showToast from '../../utils/toast';
import styles from './TwoFactorSetup.module.css';

const TwoFactorSetup = ({ onSuccess, onSkip }) => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const setupTwoFactorMutation = useMutation({
    mutationFn: authEndpoints.setupTwoFactor,
    onSuccess: (response) => {
      const { config_url, token } = response.data;
      setQrCode(config_url);
      setSecretKey(token);
      showToast(response.data.message, response.data.type);
    },
    onError: (error) => {
      showToast(
        error.response?.data?.message || 'Failed to setup two-factor authentication',
        'error'
      );
    },
  });

  const confirmTwoFactorMutation = useMutation({
    mutationFn: (token) => authEndpoints.confirmTwoFactor(token),
    onSuccess: (response) => {
      setIsSetup(true);
      showToast(response.data.message, response.data.type);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      showToast(
        error.response?.data?.message || 'Failed to confirm two-factor authentication',
        'error'
      );
    },
  });

  const cancelSetupMutation = useMutation({
    mutationFn: authEndpoints.cancelTwoFactorSetup,
    onSuccess: (response) => {
      showToast(response.data.message, response.data.type);
      if (onSkip) {
        onSkip();
      }
    },
    onError: (error) => {
      showToast(
        error.response?.data?.message || 'Failed to cancel setup',
        'error'
      );
    },
  });

  const handleSetup = () => {
    setupTwoFactorMutation.mutate();
  };

  const handleConfirm = () => {
    if (!verificationCode) {
      showToast('Please enter the verification code', 'error');
      return;
    }
    confirmTwoFactorMutation.mutate(verificationCode);
  };

  const handleSkip = () => {
    cancelSetupMutation.mutate();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Two-Factor Authentication Setup</h1>
      
      {!qrCode ? (
        <div className={styles.setupSection}>
          <p className={styles.description}>
            Enhance your account security by enabling two-factor authentication.
          </p>
          <button 
            onClick={handleSetup} 
            className={styles.setupButton}
            disabled={setupTwoFactorMutation.isLoading}
          >
            {setupTwoFactorMutation.isLoading ? 'Setting up...' : 'Setup 2FA'}
          </button>
        </div>
      ) : !isSetup ? (
        <div className={styles.configSection}>
          <div className={styles.qrCodeContainer}>
            <QRCodeSVG value={qrCode} size={200} />
            <div className={styles.instructions}>
              <p>1. Scan this QR code with your authenticator app</p>
              <p>2. Can't scan? Use this secret key: <code>{secretKey}</code></p>
              <p>3. Enter the verification code from your app below</p>
            </div>
          </div>
          <div className={styles.verificationSection}>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className={styles.input}
              maxLength={6}
            />
            <button 
              onClick={handleConfirm} 
              className={styles.confirmButton}
              disabled={confirmTwoFactorMutation.isLoading}
            >
              {confirmTwoFactorMutation.isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.successSection}>
          <p className={styles.successMessage}>
            🎉 Two-factor authentication has been successfully enabled for your account!
          </p>
          <button onClick={onSuccess} className={styles.continueButton}>
            Continue to Dashboard
          </button>
        </div>
      )}
      
      {!isSetup && (
        <button 
          onClick={handleSkip} 
          className={styles.skipButton}
          disabled={cancelSetupMutation.isLoading}
        >
          {cancelSetupMutation.isLoading ? 'Canceling...' : 'Skip for now'}
        </button>
      )}
    </div>
  );
};

export default TwoFactorSetup;