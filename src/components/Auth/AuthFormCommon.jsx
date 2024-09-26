import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import styles from './AuthForm.module.css';

export const InputField = ({ icon: Icon, error, ...props }) => (
  <div className={styles.inputContainer}>
    <Icon className={styles.icon} size={20} />
    <input className={`${styles.inputField} ${error ? styles.inputError : ''}`} {...props} />
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

export const PasswordInput = ({ error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles.inputContainer}>
      <Lock className={styles.icon} size={20} />
      <input
        type={showPassword ? 'text' : 'password'}
        className={`${styles.inputField} ${error ? styles.inputError : ''}`}
        {...props}
      />
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export { Mail, User, Lock };