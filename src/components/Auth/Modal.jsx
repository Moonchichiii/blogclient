import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import EmailConfirmation from './EmailConfirmation';

const Modal = ({ isOpen, onClose, initialView, showToast }) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        {view === 'signin' && (
          <>
            <h2 className={styles.heading}>Sign in to your account</h2>
            <SignInForm onSuccess={onClose} showToast={showToast} />
            <button className={styles.toggleButton} onClick={() => setView('signup')}>
              Need an account? Sign up
            </button>
          </>
        )}
        {view === 'signup' && (
          <>
            <h2 className={styles.heading}>Create a new account</h2>
            <SignUpForm onSuccess={() => setView('emailConfirmation')} showToast={showToast} />
            <button className={styles.toggleButton} onClick={() => setView('signin')}>
              Already have an account? Sign in
            </button>
          </>
        )}
        {view === 'emailConfirmation' && (
          <EmailConfirmation
            isInModal={true}
            onSuccess={() => {
              setView('signin');
            }}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;