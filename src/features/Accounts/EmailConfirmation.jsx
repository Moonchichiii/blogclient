import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import styles from './EmailConfirmation.module.css';
import { authEndpoints } from '../../api/endpoints';
import { useAuth } from './hooks/useAuth';
import showToast from '../../utils/Toast';

const EmailConfirmation = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); // Assuming your useAuth hook has this function
  const [status, setStatus] = useState('confirming');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const confirmEmailMutation = useMutation(
    () => authEndpoints.confirmEmail(uidb64, token),
    {
      onSuccess: async (response) => {
        const data = response.data;
        setStatus('success');
        const { access, refresh } = data.tokens;
        Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
        Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
        setIsAuthenticated(true); // Update authentication state
        showToast(data.message, data.type);
        navigate('/setup-2fa');
      },
      onError: (error) => {
        setStatus('error');
        showToast(
          error.response?.data?.message || 'Email verification failed. Please try again.',
          'error'
        );
      },
    }
  );

  // Automatically trigger email confirmation on component mount
  useEffect(() => {
    confirmEmailMutation.mutate();
  }, []); // Empty array ensures this runs only once when the component is mounted

  // Mutation for resending the verification email
  const resendVerificationMutation = useMutation(
    (email) => authEndpoints.resendVerification(email),
    {
      onSuccess: (response) => {
        showToast(response.data.message, response.data.type);
        setIsResending(false); // Reset the resending state after success
      },
      onError: (error) => {
        showToast(
          error.response?.data?.message || 'An error occurred while resending the verification email.',
          'error'
        );
        setIsResending(false); // Reset the resending state even if it fails
      },
    }
  );

  // Handle resend email form submission
  const handleResendSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email before resending.', 'error');
      return;
    }

    setIsResending(true); // Indicate resending is in progress

    resendVerificationMutation.mutate(email);
  };

  return (
    <div className={styles.container}>
      {/* Feedback during confirmation */}
      {status === 'confirming' && <p>Confirming your email...</p>}

      {/* Success state */}
      {status === 'success' && (
        <div>
          <h2>Email Confirmed!</h2>
          <p>Your email has been successfully confirmed. You can now set up two-factor authentication or proceed to your account.</p>
          <button onClick={() => navigate('/setup-2fa')} className={styles.continueButton}>Continue</button>
        </div>
      )}

      {/* Error state with option to resend the verification email */}
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
