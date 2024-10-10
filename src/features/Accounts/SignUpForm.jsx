import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authEndpoints } from '../../api/endpoints';
import { useAuth } from './hooks/useAuth';
import showToast from '../../utils/Toast';
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

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  return ['Weak', 'Medium', 'Strong', 'Very Strong'][strength - 1] || 'Very Weak';
};

const SignUpForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    profile_name: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: (data) => authEndpoints.register(data),
    onSuccess: async (data) => {
      showToast(data.message, data.type);
      if (onSuccess) onSuccess('emailConfirmation');
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      showToast(error.response?.data?.message || 'An error occurred during registration.', 'error');
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Passwords don't match";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.profile_name)) {
      newErrors.profile_name = 'Profile name can only contain letters, numbers, and underscores.';
    }
    if (!formData.profile_name) newErrors.profile_name = 'Profile name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
    }
};


  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        icon={Mail}
        name="email"
        type="email"
        required
        placeholder="Email address"
        value={formData.email}
        onChange={handleInputChange}
        autoComplete="username"
        error={errors.email}
      />

<PasswordInput
  autoComplete="new-password"
  name="password"
  required
  placeholder="Password"
  value={formData.password1}
  onChange={handleInputChange}
  error={errors.password1}
/>
      <div className={styles.passwordStrength}>
        <p>Password Strength: {passwordStrength}</p>
        <div className={styles.strengthMeter}>
          <div
            className={styles.strengthBar}
            data-strength={['Weak', 'Medium', 'Strong', 'Very Strong'].indexOf(passwordStrength)}
          />
        </div>
      </div>

      <PasswordInput
        autoComplete="new-password"
        name="password2"
        required
        placeholder="Confirm Password"
        value={formData.password2}
        onChange={handleInputChange}
        error={errors.password2}
      />
      <InputField
        icon={User}
        name="profile_name"
        type="text"
        required
        placeholder="Profile Name"
        value={formData.profile_name}
        onChange={handleInputChange}
        error={errors.profile_name}
      />
      <button type="submit" className={styles.submitButton}>Sign Up</button>
    </form>
  );
};

export default SignUpForm;
