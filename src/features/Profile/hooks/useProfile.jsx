import { useState, useEffect } from 'react';
import { useAuth } from '../../Accounts/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../../../api/endpoints';
import showToast from '../../../utils/Toast';

export const useProfile = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        profile_name: currentUser.profile_name || '',
        bio: currentUser.profile?.bio || '',
        email: currentUser.email || '',
      });
      setImagePreview(currentUser.profile?.image || null);
    }
  }, [currentUser]);

  const updateProfileMutation = useMutation({
    mutationFn: userEndpoints.updateProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['currentUser']);
      showToast(response.data.message, response.data.type);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      showToast(message, 'error');
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
    handleChange,
    handleImageChange,
    handleSubmit,
  };
};