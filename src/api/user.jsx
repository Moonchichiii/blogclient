import { api, multipartApi } from './apiConfig';

export const getCurrentUser = () => api.get('/api/accounts/user/');
export const updateProfile = (userData) => api.put('/api/profiles/update-profile/', userData);
export const uploadProfilePicture = (formData) => multipartApi.post('/api/profiles/upload-profile-picture/', formData);