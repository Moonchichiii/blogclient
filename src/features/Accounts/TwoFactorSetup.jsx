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
      const data = response.data;
      setQrCode(data.config_url);
      setSecretKey(data.token);
      showToast(data.message, 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to setup two-factor authentication', 'error');
    },
  });

  const confirmTwoFactorMutation = useMutation({
    mutationFn: (token) => authEndpoints.confirmTwoFactor(token),
    onSuccess: (response) => {
      setIsSetup(true);
      showToast(response.data.message, 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to confirm two-factor authentication', 'error');
    },
  });

  const handleSetup = () => {
    setupTwoFactorMutation.mutate();
  };

  const handleConfirm = () => {
    if (verificationCode) {
      confirmTwoFactorMutation.mutate(verificationCode);
    } else {
      showToast('Please enter the verification code', 'error');
    }
  };

  const handleContinue = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSkip = () => {
    showToast('You can set up two-factor authentication later in your account settings.', 'info');
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Set Up Two-Factor Authentication</h1>
      {!qrCode ? (
        <button onClick={handleSetup} className={styles.setupButton}>
          Setup 2FA
        </button>
      ) : !isSetup ? (
        <>
          <div className={styles.qrCodeContainer}>
            <QRCodeSVG value={qrCode} size={256} />
            <p>Scan this QR code with your authenticator app</p>
            <p>If you can't scan the QR code, use this secret key: <strong>{secretKey}</strong></p>
          </div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className={styles.input}
          />
          <button onClick={handleConfirm} className={styles.confirmButton}>
            Confirm
          </button>
        </>
      ) : (
        <>
          <p className={styles.successMessage}>
            Great! Your account is now protected with two-factor authentication.
          </p>
          <button onClick={handleContinue} className={styles.continueButton}>
            Continue
          </button>
        </>
      )}
      {!isSetup && (
        <button onClick={handleSkip} className={styles.skipButton}>
          Skip for now
        </button>
      )}
    </div>
  );
};

export default TwoFactorSetup;