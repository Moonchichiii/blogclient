import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import styles from './AuthForm.module.css';
import { toast } from 'react-toastify';

// InputField component
const InputField = ({ icon: Icon, error, ...props }) => (
  <div className={styles.inputContainer}>
    <Icon className={styles.icon} size={20} />
    <input className={`${styles.inputField} ${error ? styles.inputError : ''}`} {...props} />
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

// PasswordInput component
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
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [requireOTP, setRequireOTP] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData);
      if (response.require_otp) setRequireOTP(true);
      if (response.require_email_verification) setShowResendVerification(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        icon={Mail}
        name="email"
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
      />
      <PasswordInput
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {requireOTP && (
        <InputField
          icon={Lock}
          name="otp"
          type="text"
          placeholder="One-Time Password"
          value={formData.otp}
          onChange={handleChange}
        />
      )}
      <button type="submit" className={styles.submitButton}>Sign In</button>      
    </form>
  );
};

export default SignInForm;
