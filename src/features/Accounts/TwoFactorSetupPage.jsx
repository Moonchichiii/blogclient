import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import styles from './TwoFactorSetup.module.css';
import { authEndpoints } from '../../api/endpoints';
import showToast from '../../utils/Toast';

const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const navigate = useNavigate();

  const setupTwoFactorMutation = useMutation(authEndpoints.setupTwoFactor, {
    onSuccess: (data) => {
      setQrCode(data.config_url);
      setSecretKey(data.secret_key);
      showToast('Two-factor authentication setup successful', 'success');
    },
    onError: () => {
      showToast('Failed to setup two-factor authentication', 'error');
    },
  });

  const handleSetup = () => {
    setupTwoFactorMutation.mutate();
  };

  const handleContinue = () => navigate('/dashboard');

  const handleSkip = () => {
    showToast('You can set up two-factor authentication later in your account settings.', 'info');
    navigate('/dashboard');
  };


  return (
    <div className={styles.twoFactorSetupContainer}>
      <h1 className={styles.heading}>Set Up Two-Factor Authentication</h1>
      {!isSetup ? (
        <>
          <button onClick={setupTwoFactor} className={styles.setupButton}>Setup 2FA</button>
          {qrCode && (
            <div className={styles.qrCodeContainer}>
              <QRCodeSVG value={qrCode} size={256} />
              <p>Scan this QR code with your authenticator app</p>
              <p>If you can't scan the QR code, use this secret key: {secretKey}</p>
            </div>
          )}
          <button onClick={handleSkip} className={styles.skipButton}>Skip for now</button>
        </>
      ) : (
        <>
          <p className={styles.successMessage}>Great! Your account is now protected with two-factor authentication.</p>
          <button onClick={handleContinue} className={styles.continueButton}>Continue to Dashboard</button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;
