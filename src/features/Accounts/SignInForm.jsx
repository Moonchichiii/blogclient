// SignInForm.jsx

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toast';
import styles from './AuthForm.module.css';

const InputField = ({ icon: Icon, error, ...props }) => (
  <div className={styles.inputContainer}>
    <Icon className={styles.icon} size={20} />
    <input className={`${styles.inputField} ${error ? styles.inputError : ''}`} {...props} />
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

const PasswordInput = ({ error, ...props }) => {
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

const SignInForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, pending2FA, verify2FA } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTwoFactorChange = (e) => {
    setTwoFactorCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await login(formData);
        if (response.data.type === 'success') {
          if (onSuccess) onSuccess();
          navigate('/dashboard');
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'An error occurred during login', 'error');
        if (error.response?.data?.errors) setErrors(error.response.data.errors);
      }
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    if (twoFactorCode.trim() === '') {
      showToast('Please enter the 2FA code', 'error');
      return;
    }
    try {
      const response = await verify2FA({ user_id: pending2FA.user_id, token: twoFactorCode });
      if (response.data.type === 'success') {
        if (onSuccess) onSuccess();
        navigate('/dashboard');
      }
    } catch (error) {
      
    }
  };

  if (pending2FA) {
    return (
      <form className={styles.form} onSubmit={handleTwoFactorSubmit}>
        <div className={styles.inputContainer}>
          <Lock className={styles.icon} size={20} />
          <input
            type="text"
            name="twoFactorCode"
            placeholder="Enter 2FA code"
            value={twoFactorCode}
            onChange={handleTwoFactorChange}
            autoComplete="one-time-code"
            className={styles.inputField}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Verify
        </button>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        icon={Mail}
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        autoComplete="username"
        error={errors.email}
      />
      <PasswordInput
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
        error={errors.password}
      />
      <button type="submit" className={styles.submitButton}>
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
