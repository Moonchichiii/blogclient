import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../../store/authSlice';
import { authEndpoints } from '../../../api/endpoints';
import styles from './AuthForm.module.css';
import { InputField, PasswordInput, Mail, User } from './AuthFormCommon';
import PasswordStrength from '../Utils/PasswordStrength';

const SignUpForm = ({ onSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    profile_name: '',
  });
  const [errors, setErrors] = useState({});
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
      showToast('Registration successful! Please check your email to verify your account.', 'success');
      onSuccess('emailConfirmation');
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'An error occurred'));
      if (error.response?.data) {
        setErrors(error.response.data);
        Object.entries(error.response.data).forEach(([key, value]) => {
          showToast(`${key}: ${value}`, 'error');
        });
      } else {
        showToast('An error occurred during registration', 'error');
      }
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
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
      <PasswordStrength password={formData.password1} />
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