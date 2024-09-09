import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { setUser } from '../../store/userSlice';
import { login, register } from '../../api/auth';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import styles from './AuthForm.module.css';
import Cookies from 'js-cookie';

const InputField = ({ icon: Icon, ...props }) => (
  <div className={styles.inputContainer}>
    <Icon className={styles.icon} size={20} />
    <input className={styles.inputField} {...props} />
  </div>
);

const PasswordInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles.inputContainer}>
      <Lock className={styles.icon} size={20} />
      <input
        type={showPassword ? 'text' : 'password'}
        className={styles.inputField}
        {...props}
      />
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const SignInForm = ({ onSuccess, showToast }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await login(formData);
      if (response.data.user.is_active) {
        Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'strict' });
        Cookies.set('refresh_token', response.data.refresh, { secure: true, sameSite: 'strict' });
        dispatch(loginSuccess());
        dispatch(setUser(response.data.user));
        onSuccess();
        showToast('Login successful!', 'success');
      } else {
        dispatch(loginFailure('Please verify your email before logging in.'));
        showToast('Please verify your email before logging in.', 'error');
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
      <button type="submit" className={styles.submitButton}>Sign In</button>
    </form>
  );
};

const SignUpForm = ({ onSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    profile_name: '',
  });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      await register(formData);
      dispatch(loginSuccess());
      onSuccess();
      showToast('Registration successful! Please check your email to verify your account.', 'success');
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
        name="password1"
        required
        placeholder="Password"
        value={formData.password1}
        onChange={(e) => setFormData({ ...formData, password1: e.target.value })}
      />
      <PasswordInput
        name="password2"
        required
        placeholder="Confirm Password"
        value={formData.password2}
        onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
      />
      <InputField
        icon={User}
        name="profile_name"
        type="text"
        required
        placeholder="Profile Name"
        value={formData.profile_name}
        onChange={(e) => setFormData({ ...formData, profile_name: e.target.value })}
      />
      <button type="submit" className={styles.submitButton}>Sign Up</button>
    </form>
  );
};

export { SignInForm, SignUpForm };