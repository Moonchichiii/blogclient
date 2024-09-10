import React, { useState } from 'react';
import { api } from '../../../api/apiConfig';
import { QRCodeSVG } from 'qrcode.react';
import styles from './TwoFactorSetup.module.css';

const TwoFactorSetup = ({ showToast }) => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const setupTwoFactor = async () => {
    try {
      const response = await api.post('/api/accounts/setup-2fa/');
      setQrCode(response.data.config_url);
      setSecretKey(response.data.secret_key);
      showToast('Two-factor authentication setup successful', 'success');
    } catch (error) {
      showToast('Failed to setup two-factor authentication', 'error');
    }
  };

  return (
    <div className={styles.twoFactorSetup}>
      <h2>Setup Two-Factor Authentication</h2>
      <button onClick={setupTwoFactor} className={styles.setupButton}>
        Setup 2FA
      </button>
      {qrCode && (
        <div className={styles.qrCodeContainer}>
          <QRCodeSVG value={qrCode} size={256} />
          <p>Scan this QR code with your authenticator app</p>
        </div>
      )}
      {secretKey && (
        <div className={styles.secretKeyContainer}>
          <p>If you can't scan the QR code, use this secret key: {secretKey}</p>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;