import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../../api/endpoints';
import useToast from '../../hooks/useToast';

const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: user, isLoading, error } = useQuery(['currentUser'], userEndpoints.getCurrentUser);

  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        profile_name: user.profile_name || '',
        bio: user.profile?.bio || '',
        email: user.email || '',
      });
      setImagePreview(user.profile?.image || null);
    }
  }, [user]);

  const updateProfileMutation = useMutation(userEndpoints.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    },
    onError: () => {
      showToast('Failed to update profile. Please try again.', 'error');
    },
  });

  // Handle form changes and submit (same as before)

  return {
    user,
    formData,
    imagePreview,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    handleImageChange,
    handleChange,
    handleSubmit,
  };
};

export default ProfileSettings;