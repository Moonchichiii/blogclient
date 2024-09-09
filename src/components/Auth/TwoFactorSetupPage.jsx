import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TwoFactorSetup from './TwoFactorSetup';
import styles from './TwoFactorSetupPage.module.css';

const TwoFactorSetupPage = ({ showToast }) => {
  const [isSetup, setIsSetup] = useState(false);
  const navigate = useNavigate();

  const handleSetupComplete = () => {
    setIsSetup(true);
    showToast('Two-factor authentication setup complete!', 'success');
  };

  const handleSkip = () => {
    showToast('You can set up two-factor authentication later in your account settings.', 'info');
    navigate('/dashboard');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <h1>Set Up Two-Factor Authentication</h1>
      <p>Enhance your account security with two-factor authentication.</p>
      {!isSetup ? (
        <>
          <TwoFactorSetup showToast={showToast} onSetupComplete={handleSetupComplete} />
          <button onClick={handleSkip} className={styles.skipButton}>Skip for now</button>
        </>
      ) : (
        <>
          <p>Great! Your account is now protected with two-factor authentication.</p>
          <button onClick={handleContinue} className={styles.continueButton}>Continue to Dashboard</button>
        </>
      )}
    </div>
  );
};

export default TwoFactorSetupPage;