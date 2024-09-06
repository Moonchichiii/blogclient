import React, { useState } from 'react';
import styles from './Modal.module.css';
import { SignInForm, SignUpForm } from './AuthForm';

const Modal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
        <h2 className={styles.heading}>
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        {isLogin ? (
          <SignInForm onSuccess={onClose} />
        ) : (
          <SignUpForm onSuccess={onClose} />
        )}
        <button className={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default Modal;