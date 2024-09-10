import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/authSlice';
import { setUser, fetchCurrentUser } from '../../../store/userSlice';
import useAuth from '../../../hooks/useAuth';
import Cookies from 'js-cookie';
import styles from './EmailConfirmation.module.css';

const EmailConfirmation = ({ showToast }) => {
  const [status, setStatus] = useState('confirming');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uidb64, token } = useParams();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const confirmationStatus = params.get('status');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (confirmationStatus === 'success' && accessToken && refreshToken) {
      setStatus('success');
      
      // Store tokens
      Cookies.set('access_token', accessToken, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refreshToken, { secure: true, sameSite: 'strict' });
      
      // Update Redux state
      dispatch(loginSuccess({ accessToken, refreshToken }));
      
      // Fetch user data
      dispatch(fetchCurrentUser())
        .then(() => {
          showToast('Email verified successfully!', 'success');
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          showToast('Email verified, but there was an error fetching your data.', 'warning');
        });
    } else if (confirmationStatus === 'error') {
      setStatus('error');
      showToast('Email verification failed. Please try again.', 'error');
    }
  }, [location, dispatch, showToast]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/setup-2fa');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      {status === 'confirming' && <p>Confirming your email...</p>}
      {status === 'success' && (
        <div>
          <h2>Email Confirmed!</h2>
          <p>Your email has been successfully confirmed. You can now set up two-factor authentication or proceed to your account.</p>
          <button onClick={handleContinue} className={styles.continueButton}>Continue</button>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Confirmation Failed</h2>
          <p>We couldn't confirm your email. The link may have expired or is invalid.</p>
          <button onClick={handleContinue} className={styles.loginButton}>Back to Login</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmation;