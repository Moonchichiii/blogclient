import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import styles from './EmailConfirmation.module.css';
import { authEndpoints } from '../../api/endpoints';
import { useAuth } from './hooks/useAuth';
import showToast from '../../utils/Toast';

const EmailConfirmation = () => {
  const [status, setStatus] = useState('confirming');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { uidb64, token } = useParams();
  const location = useLocation();

  const confirmEmailMutation = useMutation(
    () => authEndpoints.confirmEmail(uidb64, token),
    {
      onSuccess: (data) => {
        setStatus('success');
        Cookies.set('access_token', data.access, { secure: true, sameSite: 'strict' });
        Cookies.set('refresh_token', data.refresh, { secure: true, sameSite: 'strict' });
        login({ email: data.email, password: '' });
        queryClient.invalidateQueries(['currentUser']);
        showToast('Email verified successfully!', 'success');
      },
      onError: () => {
        setStatus('error');
        showToast('Email verification failed. Please try again.', 'error');
      },
    }
  );

  const resendVerificationMutation = useMutation(
    (email) => authEndpoints.resendVerification(email),
    {
      onSuccess: () => {
        showToast('Verification email resent successfully.', 'success');
        setIsResending(false);
      },
      onError: (error) => {
        showToast(error.response?.data?.error || 'An error occurred while resending the verification email.', 'error');
        setIsResending(false);
      },
    }
  );

  useEffect(() => {
    confirmEmailMutation.mutate();
  }, []);

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
      {status === 'confirming' && <p>Confirming your email...</p>}
      {status === 'success' && (
        <div>
          <h2>Email Confirmed!</h2>
          <p>Your email has been successfully confirmed. You can now set up two-factor authentication or proceed to your account.</p>
          <button onClick={() => navigate('/setup-2fa')} className={styles.continueButton}>Continue</button>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Confirmation Failed</h2>
          <p>We couldn't confirm your email. The link may have expired or is invalid.</p>
          <form onSubmit={handleResendSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={styles.input}
            />
            <button type="submit" disabled={isResending} className={styles.button}>
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className={styles.loginButton}>Back to Login</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmation;
