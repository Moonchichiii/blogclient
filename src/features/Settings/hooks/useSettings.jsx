import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsEndpoints } from '../../../api/endpoints';
import { useAuth } from '../../Accounts/hooks/useAuth';
import showToast from '../../../utils/toast';

export const useSettings = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [notificationSettings, setNotificationSettings] = useState({
      emailNotifications: false,
      commentNotifications: false,
      newFollowerNotifications: false,
    });
  
  
   // Initialize form data from current user
   const [formData, setFormData] = useState({
    bio: currentUser?.profile?.bio || '',
    profile_name: currentUser?.profile_name || '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(currentUser?.profile?.image || null);

  // Form Handling
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationUpdate = (type) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const formDataObj = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          formDataObj.append(key, data[key]);
        }
      });
      return settingsEndpoints.updateProfile(formDataObj);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      showToast('Profile updated successfully', 'success');
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    },
  });

  // Email Mutation
  const updateEmailMutation = useMutation({
    mutationFn: settingsEndpoints.updateEmail,
    onSuccess: () => {
      showToast('Email verification sent', 'success');
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to update email', 'error');
    },
  });

  // Two-Factor Authentication Mutations
  const setupTwoFactorMutation = useMutation({
    mutationFn: settingsEndpoints.setupTwoFactor,
    onSuccess: (response) => {
      setModalContent({
        type: '2fa-setup',
        data: response.data,
      });
      setIsModalOpen(true);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to setup 2FA', 'error');
    },
  });

  const confirmTwoFactorMutation = useMutation({
    mutationFn: settingsEndpoints.confirmTwoFactor,
    onSuccess: () => {
      showToast('Two-factor authentication enabled successfully', 'success');
      queryClient.invalidateQueries(['currentUser']);
      setIsModalOpen(false);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to confirm 2FA', 'error');
    },
  });

  const disableTwoFactorMutation = useMutation({
    mutationFn: settingsEndpoints.disableTwoFactor,
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      showToast('Two-factor authentication disabled', 'success');
      setIsModalOpen(false);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to disable 2FA', 'error');
    },
  });

  // Password Reset Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: settingsEndpoints.resetPassword,
    onSuccess: () => {
      showToast('Password reset email sent', 'success');
      setIsModalOpen(false);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to send reset email', 'error');
    },
  });

  // Account Deletion Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: settingsEndpoints.deleteAccount,
    onSuccess: () => {
      showToast('Account deleted successfully', 'success');
      window.location.href = '/';
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to delete account', 'error');
    },
  });

  // Action Handlers
  const handleProfileUpdate = async (data) => {
    await updateProfileMutation.mutateAsync(data);
  };

  const handleEmailUpdate = async (data) => {
    await updateEmailMutation.mutateAsync(data);
  };

  const handlePasswordReset = async () => {
    if (currentUser?.email) {
      await resetPasswordMutation.mutateAsync(currentUser.email);
    }
  };

  const handleSetupTwoFactor = async () => {
    await setupTwoFactorMutation.mutateAsync();
  };

  const handleConfirmTwoFactor = async (token) => {
    await confirmTwoFactorMutation.mutateAsync(token);
  };

  const handleDisableTwoFactor = async () => {
    await disableTwoFactorMutation.mutateAsync();
  };

  const handleAccountDeletion = async (data) => {
    await deleteAccountMutation.mutateAsync(data);
  };

  return {
    // State
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    formData,
    setFormData,
    notificationSettings,
    imagePreview,

    // Form Handlers
    handleChange,
    handleImageChange,
    handleNotificationUpdate,

    // Profile
    handleProfileUpdate,
    isProfileUpdating: updateProfileMutation.isLoading,
    profileError: updateProfileMutation.error,

    // Email
    handleEmailUpdate,
    isEmailUpdating: updateEmailMutation.isLoading,
    emailError: updateEmailMutation.error,

    // Two-Factor
    handleSetupTwoFactor,
    handleConfirmTwoFactor,
    handleDisableTwoFactor,
    isTwoFactorSetting: setupTwoFactorMutation.isLoading,
    isTwoFactorDisabling: disableTwoFactorMutation.isLoading,
    twoFactorError: setupTwoFactorMutation.error,

    // Password
    handlePasswordReset,
    isPasswordResetting: resetPasswordMutation.isLoading,
    passwordError: resetPasswordMutation.error,

    // Account Deletion
    handleAccountDeletion,
    isDeletingAccount: deleteAccountMutation.isLoading,
    deletionError: deleteAccountMutation.error,
  };
};