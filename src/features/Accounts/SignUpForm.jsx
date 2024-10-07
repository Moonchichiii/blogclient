import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from './authSlice';
import { authEndpoints } from '../../api/endpoints';
import styles from './AuthForm.module.css';

const InputField = React.memo(({ icon: Icon, error, ...props }) => (
  <div className={styles.inputContainer}>
    <Icon className={styles.icon} size={20} />
    <input className={`${styles.inputField} ${error ? styles.inputError : ''}`} {...props} />
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
));

const PasswordInput = ({ error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

const calculatePasswordStrength = (password) => {
  if (password.length < 6) return 'Weak';
  if (password.length < 10) return 'Medium';
  return 'Strong';
};

const SignUpForm = ({ onSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    profile_name: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (formData.password1 !== formData.password2) {
      newErrors.password = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());
    try {
      await authEndpoints.register(formData);
      dispatch(loginSuccess());
      onSuccess('emailConfirmation');
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors(error.response.data);
        const nonFieldErrors = error.response.data.non_field_errors;
        if (nonFieldErrors) {
          showToast(nonFieldErrors.join(' '), 'error');
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (name === 'password1') {
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
        error={errors.email}
      />
      <PasswordInput
        name="password1"
        required
        placeholder="Password"
        value={formData.password1}
        onChange={handleInputChange}
        error={errors.password}
      />
      <p className={styles.passwordStrength}>Password Strength: {passwordStrength}</p>
      <PasswordInput
        name="password2"
        required
        placeholder="Confirm Password"
        value={formData.password2}
        onChange={handleInputChange}
        error={errors.password}
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