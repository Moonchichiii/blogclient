import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import { fetchCurrentUser } from '../Profile/hooks/profileSlice';
import Cookies from 'js-cookie';
import styles from './EmailConfirmation.module.css';
import { api } from '../../api/apiConfig';

const EmailConfirmation = ({ showToast }) => {
  const [status, setStatus] = useState('confirming');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uidb64, token } = useParams();
  const location = useLocation();

  // Handle email confirmation status based on query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const confirmationStatus = params.get('status');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (confirmationStatus === 'success' && accessToken && refreshToken) {
      setStatus('success');
      Cookies.set('access_token', accessToken, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refreshToken, { secure: true, sameSite: 'strict' });
      dispatch(loginSuccess({ accessToken, refreshToken }));
      dispatch(fetchCurrentUser())
        .then(() => showToast('Email verified successfully!', 'success'))
        .catch(() => showToast('Email verified, but there was an error fetching your data.', 'warning'));
    } else if (confirmationStatus === 'error') {
      setStatus('error');
      showToast('Email verification failed. Please try again.', 'error');
    }
  }, [location, dispatch, showToast]);

  // Resend verification email function
  const resendVerification = async () => {
    if (!email) {
      showToast('Please enter your email before resending.', 'error');
      return;
    }

    setIsResending(true);
    try {
      await api.post('/api/accounts/resend-verification/', { email });
      showToast('Verification email resent successfully.', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'An error occurred while resending the verification email.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  // Handle the form submission for resending the verification email
  const handleResendSubmit = (e) => {
    e.preventDefault();
    resendVerification();
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
