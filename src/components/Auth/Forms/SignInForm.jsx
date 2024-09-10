import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../../store/authSlice';
import { setUser } from '../../../store/userSlice';
import { login } from '../../../api/auth';
import Cookies from 'js-cookie';
import styles from './AuthForm.module.css';
import { InputField, PasswordInput, Mail, Lock } from './AuthFormCommon';
import ResendVerification from '../Utils/ResendVerification';

const SignInForm = ({ onSuccess, showToast }) => {
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [requireOTP, setRequireOTP] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await login(formData);
      if (response.data.require_otp) {
        setRequireOTP(true);
        showToast('Please enter your OTP', 'info');
      } else if (response.data.require_email_verification) {
        setShowResendVerification(true);
        showToast('Please verify your email before logging in', 'warning');
      } else {
        Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'strict' });
        Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'strict' });
        dispatch(loginSuccess());
        dispatch(setUser(response.data.user));
        onSuccess();
        showToast('Login successful!', 'success');
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'An error occurred'));
      showToast(error.response?.data?.message || 'An error occurred', 'error');
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
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <PasswordInput
        name="password"
        required
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {requireOTP && (
        <InputField
          icon={Lock}
          name="otp"
          type="text"
          required
          placeholder="One-Time Password"
          value={formData.otp}
          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
        />
      )}
      <button type="submit" className={styles.submitButton}>Sign In</button>
      {showResendVerification && <ResendVerification showToast={showToast} />}
    </form>
  );
};

export default SignInForm;