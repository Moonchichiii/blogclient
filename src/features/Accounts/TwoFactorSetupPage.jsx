import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';

import { authEndpoints } from '../../api/endpoints';
import { useAuth } from './hooks/useAuth';
import showToast from '../../utils/toast';
import styles from './TwoFactorSetupPage.module.css';

const TwoFactorSetup = ({ onSuccess, onSkip }) => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const setupTwoFactorMutation = useMutation({
    mutationFn: authEndpoints.setupTwoFactor,
    onSuccess: (response) => {
      const data = response.data;
      setQrCode(data.config_url);
      setSecretKey(data.secret_key);
      setIsSetup(true);
      showToast(data.message, data.type);
    },
    onError: () => {
      showToast('Failed to setup two-factor authentication', 'error');
    },
  });

  const handleSetup = () => {
    setupTwoFactorMutation.mutate();
  };

  const handleContinue = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    showToast('You can set up two-factor authentication later in your account settings.', 'info');
    if (onSkip) {
      onSkip();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.twoFactorSetupContainer}>
      <h1 className={styles.heading}>Set Up Two-Factor Authentication</h1>
      {!isSetup ? (
        <>
          <button onClick={handleSetup} className={styles.setupButton}>
            Setup 2FA
          </button>

          {qrCode && (
            <div className={styles.qrCodeContainer}>
              <QRCodeSVG value={qrCode} size={256} />
              <p>Scan this QR code with your authenticator app</p>
              <p>If you can't scan the QR code, use this secret key: <strong>{secretKey}</strong></p>
            </div>
          )}

          <button onClick={handleSkip} className={styles.skipButton}>
            Skip for now
          </button>
        </>
      ) : (
        <>
          <p className={styles.successMessage}>
            Great! Your account is now protected with two-factor authentication.
          </p>
          <button onClick={handleContinue} className={styles.continueButton}>
            Continue to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;
