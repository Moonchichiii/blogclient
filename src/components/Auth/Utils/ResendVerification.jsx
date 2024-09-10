import React, { useState } from 'react';
import { api } from '../../../api/apiConfig';
import styles from './ResendVerification.module.css';

const ResendVerification = ({ showToast }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/api/accounts/resend-verification/', { email });
      showToast('Verification email resent successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className={styles.input}
      />
      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? 'Sending...' : 'Resend Verification Email'}
      </button>
    </form>
  );
};

export default ResendVerification;