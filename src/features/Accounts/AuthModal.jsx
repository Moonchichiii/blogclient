import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';
import TwoFactorSetup from './TwoFactorSetup';
import styles from './AuthModal.module.css';


const AuthModal = ({
  isOpen,
  onClose,
  initialView,
  onSuccess,
  disableClose = false,
}) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');


  useEffect(() => {
    setView(initialView);
  }, [initialView]);


  const handleSignUpSuccess = (userEmail) => {
    setEmail(userEmail);
    setView('emailConfirmation');
  };


  const handleEmailConfirmationSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      setView('signin');
    }
  };


  const handleTwoFactorSetupSuccess = () => {
    onSuccess?.();
  };


  const handleTwoFactorSetupSkip = () => {
    if (disableClose) {
      onClose();
    } else {
      setView('signin');
    }
  };


  const handleModalClose = () => {
    if (!disableClose) {
      onClose();
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      closeOnOverlayClick={!disableClose}
    >
      <div className={styles.authModal}>
        {view === 'signin' && (
          <>
            <h2 className={styles.heading}>Sign in to your account</h2>
            <SignInForm
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
            />
            <button
              onClick={() => setView('signup')}
              className={styles.toggleButton}
            >
              Need an account? Sign up
            </button>
          </>
        )}
        {view === 'signup' && (
          <>
            <h2 className={styles.heading}>Create a new account</h2>
            <SignUpForm onSuccess={handleSignUpSuccess} />
            <button
              onClick={() => setView('signin')}
              className={styles.toggleButton}
            >
              Already have an account? Sign in
            </button>
          </>
        )}
        {view === 'emailConfirmation' && (
          <EmailConfirmation
            isInModal={true}
            onSuccess={handleEmailConfirmationSuccess}
            email={email}
          />
        )}
        {view === 'twoFactorSetup' && (
          <TwoFactorSetup
            onSuccess={handleTwoFactorSetupSuccess}
            onSkip={handleTwoFactorSetupSkip}
          />
        )}
      </div>
    </Modal>
  );
};


export default AuthModal;