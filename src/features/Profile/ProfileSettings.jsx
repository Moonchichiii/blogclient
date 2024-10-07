import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { fetchCurrentUser, updateUserProfile } from './hooks/profileSlice';
import { userEndpoints } from '../../api/endpoints';
import useToast from '../../hooks/useToast';

// Hook for fetching profile data
export const useProfile = () => {
  return useQuery('currentUser', userEndpoints.getCurrentUser, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
};

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    profile_name: '',
    bio: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
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

  // Mutation for updating profile
  const mutation = useMutation(userEndpoints.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentUser');
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    },
    onError: () => {
      showToast('Failed to update profile. Please try again.', 'error');
    },
  });

  // Handle form changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      showToast('Image must be less than 2MB.', 'error');
    } else if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append('profile_name', formData.profile_name);
    updatedFormData.append('bio', formData.bio);
    if (imageFile) {
      updatedFormData.append('image', imageFile);
    }
    mutation.mutate(updatedFormData);
  };

  return {
    user,
    formData,
    imagePreview,
    loading,
    error,
    isEditing,
    setIsEditing,
    handleImageChange,
    handleChange,
    handleSubmit,
  };
};

export default ProfileSettings;
