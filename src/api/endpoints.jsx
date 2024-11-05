import { api, multipartApi } from './apiConfig';

// Accounts endpoints
export const authEndpoints = {
  login: (credentials) => api.post('/api/accounts/login/', credentials),
  register: (userData) => api.post('/api/accounts/register/', userData),
  activateAccount: (token) => api.get('/api/accounts/activate/', { params: { token } }),
  resendVerification: (email) => api.post('/api/accounts/resend-verification/', { email }),
  
  setupTwoFactor: () => api.post('/api/accounts/setup-2fa/'),
  confirmTwoFactor: (token) => api.put('/api/accounts/setup-2fa/', { token }),
  cancelTwoFactorSetup: () => api.delete('/api/accounts/setup-2fa/'),
  verifyTwoFactor: (data) => api.post('/api/accounts/verify-2fa/', data),

  verifyTwoFactor: (data) => api.post('/api/accounts/verify-2fa/', data),
  disableTwoFactor: () => api.delete('/api/accounts/setup-2fa/'),

  refreshToken: (refreshToken) => api.post('/api/accounts/token/refresh/', { refresh: refreshToken }),
  logout: () => api.post('/api/accounts/logout/'),
};

// User endpoints (since user info is in accounts)
export const userEndpoints = {
  getCurrentUser: () => api.get('/api/accounts/current-user/'),
  updateProfileName: (data) => api.put('/api/accounts/update-profile-name/', data),
  getPopularFollowers: (userId) => api.get(`/api/followers/${userId}/popular-followers/`),
};

// Post endpoints
export const postEndpoints = {
  getPostPreviews: (params) => api.get('/api/posts/previews/', { params }),
  fetchPost: (id) => api.get(`/api/posts/${id}/`),
  getPosts: (params) => api.get('/api/posts/', { params }),
  getPost: (id) => api.get(`/api/posts/${id}/`),
  getUserPosts: (params) =>
    api.get('/api/posts/', {
      params: {
        ...params,
        author: 'current',
      },
    }),
  createPost: (postData) => multipartApi.post('/api/posts/', postData),
  updatePost: (id, postData) => multipartApi.put(`/api/posts/${id}/`, postData),
  deletePost: (id) => api.delete(`/api/posts/${id}/`),
  ratePost: (id, rating) => api.post('/api/ratings/rate/', { post: id, value: rating }),
  // Approve and Disapprove endpoints
  getUnapprovedPosts: () => api.get('/api/posts/unapproved/'),
  approvePost: (id) => api.put(`/api/posts/${id}/approve/`),
  disapprovePost: (id, reason) => api.post(`/api/posts/${id}/disapprove/`, { reason }),
};

// Comment endpoints
export const commentEndpoints = {
  getComments: (postId, params) => api.get(`/api/posts/${postId}/comments/`, { params }),
  createComment: (postId, commentData) => api.post(`/api/posts/${postId}/comments/`, commentData),
  updateComment: (commentId, commentData) => api.put(`/api/comments/${commentId}/`, commentData),
  deleteComment: (commentId) => api.delete(`/api/comments/${commentId}/`),
};

export const ratingEndpoints = {
  ratePost: (postId, value) => api.post('/api/ratings/', { 
    post: postId, 
    value: Math.min(Math.max(value, 1), 5) 
  }),
  getRating: (postId) => api.get(`/api/ratings/${postId}/`),
};

// Tag endpoints
export const tagEndpoints = {
  createTag: (contentType, objectId, taggedUserId) =>
    api.post('/api/tags/create-tag/', {
      content_type: contentType,
      object_id: objectId,
      tagged_user: taggedUserId,
    }),
};

export const followerEndpoints = {
  followUser: (followedId) => api.post('/api/followers/follow/', { followed: followedId }),
  unfollowUser: (followedId) => api.delete('/api/followers/follow/', { data: { followed: followedId } }),
  getFollowers: (userId) => api.get(`/api/followers/${userId}/`),
  getPopularFollowers: (userId) => api.get(`/api/followers/${userId}/popular-followers/`),
};


// Settings endpoints
export const settingsEndpoints = {
  // Profile settings
  updateProfile: (userData) => multipartApi.put('/api/profiles/current/', userData),
  updateProfileName: (userId, data) => api.patch(`/api/profiles/${userId}/`, data),
  uploadProfilePicture: (formData) => multipartApi.post('/api/accounts/upload-profile-picture/', formData),

  // Account settings
  updateEmail: (email) => api.put('/api/accounts/update-email/', { email }),
  deleteAccount: () => api.post('/api/accounts/delete-account/'),

  // Password & Security
  resetPassword: (email) => api.post('/api/accounts/password-reset/', { email }),
  confirmPasswordReset: (data) => api.post('/api/accounts/password-reset/confirm/', data),

  // Two-Factor Authentication
  setupTwoFactor: () => api.post('/api/accounts/setup-2fa/'),
  confirmTwoFactor: (token) => api.put('/api/accounts/setup-2fa/', { token }),
  cancelTwoFactorSetup: () => api.delete('/api/accounts/setup-2fa/'),
  verifyTwoFactor: (data) => api.post('/api/accounts/verify-2fa/', data),

  // Notification settings
  getNotificationSettings: () => api.get('/api/notifications/settings/'),
  updateNotificationSettings: (settings) => api.put('/api/notifications/settings/', settings),
};
