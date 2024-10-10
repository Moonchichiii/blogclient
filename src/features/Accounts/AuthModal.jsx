import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialView, showToast }) => {
  const [view, setView] = useState(initialView);

  // Add this useEffect to update the view when initialView changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.authModal}>
        {view === 'signin' && (
          <>
            <h2 className={styles.heading}>Sign in to your account</h2>
            <SignInForm onSuccess={onClose} showToast={showToast} />
            <button onClick={() => setView('signup')} className={styles.toggleButton}>
              Need an account? Sign up
            </button>
          </>
        )}
        {view === 'signup' && (
          <>
            <h2 className={styles.heading}>Create a new account</h2>
            <SignUpForm onSuccess={() => setView('emailConfirmation')} showToast={showToast} />
            <button onClick={() => setView('signin')} className={styles.toggleButton}>
              Already have an account? Sign in
            </button>
          </>
        )}
        {view === 'emailConfirmation' && (
          <EmailConfirmation
            isInModal={true}
            onSuccess={() => setView('signin')}
            showToast={showToast}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;