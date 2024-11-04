import React, { useState, useEffect } from 'react';
import { Mail, AlertCircle, Loader } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authEndpoints } from '../../api/endpoints';
import showToast from '../../utils/toast';
import styles from './EmailConfirmation.module.css';

const EmailConfirmation = ({ email: initialEmail, onClose, onSuccess }) => {
  const [email] = useState(initialEmail || '');
  const [timeLeft, setTimeLeft] = useState(60);
  const [emailSent, setEmailSent] = useState(true);

  const resendMutation = useMutation({
    mutationFn: () => authEndpoints.resendVerification(email),
    onSuccess: (response) => {
      setTimeLeft(60);
      setEmailSent(true);
      showToast('Verification email resent successfully', 'success');
    },
    onError: (error) => {
      setEmailSent(false);
      showToast(
        error.response?.data?.message || 'Failed to resend verification email',
        'error'
      );
    },
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResendEmail = () => {
    resendMutation.mutate();
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Mail 
          className={`${styles.icon} ${!emailSent ? styles.iconError : ''}`} 
          size={48} 
        />
      </div>
      
      <h2 className={styles.title}>
        {emailSent ? 'Check Your Email' : 'Email Delivery Issue'}
      </h2>

      {emailSent ? (
        <>
          <p className={styles.description}>
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <div className={styles.instructions}>
            <p>Please check your email and click the verification link to continue.</p>
            <p className={styles.note}>
              The verification link will open in a new window. You can close this window.
            </p>
          </div>
        </>
      ) : (
        <div className={styles.errorMessage}>
          <AlertCircle className={styles.errorIcon} size={20} />
          <p>We're having trouble delivering your verification email. Please try resending.</p>
        </div>
      )}

      {resendMutation.isLoading ? (
        <div className={styles.loadingState}>
          <Loader className={`${styles.loadingIcon} animate-spin`} size={20} />
          <span>Sending verification email...</span>
        </div>
      ) : timeLeft > 0 ? (
        <p className={styles.resendTimer}>
          Resend available in {timeLeft} seconds
        </p>
      ) : (
        <button 
          onClick={handleResendEmail}
          className={styles.resendButton}
          disabled={resendMutation.isLoading}
        >
          Resend Verification Email
        </button>
      )}

      <div className={styles.helpText}>
        <p>Can't find the email? Check your spam folder or try these steps:</p>
        <ul>
          <li>1. Make sure {email} is correct</li>
          <li>2. Check your spam or junk folder</li>          
          <li>3. Try resending the verification email</li>
        </ul>
      </div>     
    </div>
  );
};

export default EmailConfirmation;