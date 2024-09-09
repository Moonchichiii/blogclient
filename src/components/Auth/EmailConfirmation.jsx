import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmEmail } from '../../api/auth';
import styles from './EmailConfirmation.module.css';

const EmailConfirmation = ({ isInModal = false, onSuccess }) => {
    const [status, setStatus] = useState(isInModal ? 'waiting' : 'confirming');
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isInModal) {
        const confirm = async () => {
          try {
            await confirmEmail(uidb64, token);
            setStatus('success');
            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            setStatus('error');
          }
        };
        confirm();
      }
    }, [uidb64, token, onSuccess, isInModal]);

    const handleLoginRedirect = () => {
      if (isInModal) {
        onSuccess();
      } else {
        navigate('/');
      }
    };

    if (isInModal) {
      return (
        <div className={styles.container}>
          <h2>Check Your Email</h2>
          <p>We've sent you an email with a confirmation link. Please check your inbox and click the link to activate your account.</p>
          <button onClick={handleLoginRedirect} className={styles.loginButton}>Back to Login</button>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {status === 'confirming' && <p>Confirming your email...</p>}
        {status === 'success' && (
          <div>
            <h2>Email Confirmed!</h2>
            <p>Your email has been successfully confirmed. You can now log in to your account.</p>
            <button onClick={handleLoginRedirect} className={styles.loginButton}>Go to Login</button>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2>Confirmation Failed</h2>
            <p>We couldn't confirm your email. The link may have expired or is invalid.</p>
          </div>
        )}
      </div>
    );
};

export default EmailConfirmation;