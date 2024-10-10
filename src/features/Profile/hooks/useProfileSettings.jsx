import { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../../../api/endpoints';
import showToast from '../../../utils/toast';

export const useProfileSettings = () => {
  const { profile, isLoading, error } = useProfile();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        profile_name: profile.profile_name || '',
        bio: profile.bio || '',
        email: profile.email || '',
      });
      setImagePreview(profile.image || null);
    }
  }, [profile]);

  const updateProfileMutation = useMutation(userEndpoints.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      showToast('Profile updated successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to update profile. Please try again.', 'error');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append('profile_name', formData.profile_name);
    updateData.append('bio', formData.bio);
    if (imageFile) {
      updateData.append('image', imageFile);
    }
    updateProfileMutation.mutate(updateData);
  };

  return {
    formData,
    imagePreview,
    isLoading,
    error,
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};