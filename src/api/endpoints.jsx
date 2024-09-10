import { api, multipartApi } from './apiConfig';

// Auth endpoints
export const authEndpoints = {
  login: (credentials) => api.post('/api/accounts/login/', credentials),
  register: (userData) => api.post('/api/accounts/register/', userData),
  logout: () => api.post('/api/accounts/logout/'),
  confirmEmail: (uidb64, token) => api.get(`/api/accounts/activate/${uidb64}/${token}/`),
  resendVerification: (email) => api.post('/api/accounts/resend-verification/', { email }),
  setupTwoFactor: () => api.post('/api/accounts/setup-2fa/'),
  refreshToken: (refreshToken) => api.post('/api/accounts/token/refresh/', { refresh: refreshToken }),
};

// User endpoints
export const userEndpoints = {
  getCurrentUser: () => api.get('/api/accounts/current-user/'),
  updateProfile: (userData) => api.put('/api/profiles/update-profile/', userData),
  uploadProfilePicture: (formData) => multipartApi.post('/api/profiles/upload-profile-picture/', formData),
};

// Post endpoints
export const postEndpoints = {
  getPosts: () => api.get('/api/posts/'),
  getPost: (id) => api.get(`/api/posts/${id}/`),
  createPost: (postData) => multipartApi.post('/api/posts/', postData),
  updatePost: (id, postData) => multipartApi.put(`/api/posts/${id}/`, postData),
  deletePost: (id) => api.delete(`/api/posts/${id}/`),
  ratePost: (id, rating) => api.post(`/api/ratings/rate/`, { post: id, value: rating }),
};
