import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authEndpoints } from '../../api/endpoints';
import { useAuth } from './hooks/useAuth';
import showToast from '../../utils/toast';
import styles from './EmailConfirmation.module.css';

const EmailConfirmation = ({ isInModal, onSuccess }) => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [status, setStatus] = useState('confirming');
  const [email, setEmail] = useState('');

  const [disableResend, setDisableResend] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {    
    const timer = setTimeout(() => setDisableResend(false), 60000);
    return () => clearTimeout(timer);
  }, []);

  const confirmEmailMutation = useMutation({
    mutationFn: () => authEndpoints.confirmEmail(uidb64, token),
    onSuccess: (response) => {
      setStatus('success');
      setIsAuthenticated(true);
      showToast(response.data.message, response.data.type);

      if (isInModal && onSuccess) {
        onSuccess();
      } else {
        navigate('/setup-2fa');
      }
    },
    onError: (error) => {
      setStatus('error');
      showToast(
        error.response?.data?.message || 'Email verification failed. Please try again.',
        'error'
      );
    },
  });

  useEffect(() => {
    if (uidb64 && token) {
      confirmEmailMutation.mutate();
    }
  }, [uidb64, token]);
  
  const handleContinue = () => {
    if (isInModal && onSuccess) {
      onSuccess();
    } else {
      navigate('/setup-2fa');
    }
  };

  const resendVerificationMutation = useMutation({
    mutationFn: (email) => authEndpoints.resendVerification(email),
    onSuccess: (response) => {
      showToast(response.data.message, response.data.type);
      setIsResending(false);
    },
    onError: (error) => {
      showToast(
        error.response?.data?.message || 'An error occurred while resending the verification email.',
        'error'
      );
      setIsResending(false);
    },
  });

  const handleResendSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email before resending.', 'error');
      return;
    }

    setIsResending(true);
    resendVerificationMutation.mutate(email);
  };

  return (
    <div className={styles.container}>
      {status === 'confirming' && (
        <div className={styles.loaderContainer}>
          <p>Confirming your email...</p>
          <div className={styles.spinner}></div>
        </div>
      )}
      {status === 'success' && (
        <div>
          <p>Your email has been successfully confirmed!</p>
          <button onClick={handleContinue} className={styles.loginButton}>Sign In</button>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Confirmation Failed</h2>
          <p>
            We couldn't confirm your email. The link may have expired or is invalid.
            Please try resending the verification email.
          </p>
          <form onSubmit={handleResendSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={styles.input}
            />
            <button
              type="submit"
              disabled={isResending || disableResend}
              className={styles.button}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className={styles.loginButton}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmation;
