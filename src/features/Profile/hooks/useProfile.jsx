import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../../../api/endpoints';
import { useAuth } from '../../Accounts/hooks/useAuth';
import showToast from '../../../utils/Toast';

export const useProfile = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: () => userEndpoints.getCurrentUser(),
    enabled: isAuthenticated,
    onSuccess: (data) => {
      setFormData({
        profile_name: data.profile_name || '',
        bio: data.profile?.bio || '',
        email: data.email || '',
      });
      setImagePreview(data.profile?.image || null);
    },
  });
  

  const updateProfileMutation = useMutation({
    mutationFn: userEndpoints.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', authUser?.id]);
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
    profileData,
    formData,
    imagePreview,
    isLoading,
    error,
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};
