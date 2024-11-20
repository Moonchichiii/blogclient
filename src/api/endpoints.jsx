import { api, multipartApi } from './apiConfig';

export const QUERY_KEYS = {
  auth: {
    user: ['currentUser'],
    session: ['session'],
    twoFactor: ['twoFactor'],
    verification: ['verification'],
  },
};

const DEFAULT_CACHE_CONFIG = {
  staleTime: 300000, 
  cacheTime: 1800000, 
};

// Authentication
export const authEndpoints = {
  login: {
    request: (credentials) => api.post('/api/accounts/login/', credentials),
    queryKey: QUERY_KEYS.auth.session,
  },
  logout: {
    request: () => api.post('/api/accounts/logout/'),
    invalidates: [QUERY_KEYS.auth.user, QUERY_KEYS.auth.session],
  },
  refreshToken: {
    request: () => api.post('/api/accounts/token/refresh/'),
  },

  // Registration & Verification
  register: {
    request: (userData) => api.post('/api/accounts/register/', userData),
  },
  activateAccount: {
    request: (token) => api.get('/api/accounts/activate/', { params: { token } }),
  },
  resendVerification: {
    request: (email) => api.post('/api/accounts/resend-verification/', { email }),
  },

  // Two-Factor Authentication
  setupTwoFactor: {
    request: () => api.post('/api/accounts/setup-2fa/'),
  },
  confirmTwoFactor: {
    request: (token) => api.put('/api/accounts/setup-2fa/', { token }),
  },
  verifyTwoFactor: {
    request: (data) => api.post('/api/accounts/verify-2fa/', data),
  },
  cancelTwoFactorSetup: {
    request: () => api.delete('/api/accounts/setup-2fa/'),
  },

  // User Info
  getCurrentUser: {
    request: () => api.get('/api/accounts/current-user/'),
    ...DEFAULT_CACHE_CONFIG,
  },
};

export const createAuthCall = (endpointKey, ...args) => {
  const endpoint = authEndpoints[endpointKey];
  if (!endpoint) throw new Error(`Unknown endpoint: ${endpointKey}`);
  return endpoint.request(...args);
};

// User endpoints
export const userEndpoints = {
  getCurrentUser: () => api.get('/api/accounts/current-user/'),
  updateProfileName: (data) => api.put('/api/accounts/update-profile-name/', data),
  getPopularFollowers: (userId) => api.get(`/api/followers/${userId}/popular-followers/`),
};

// Post endpoints
export const postEndpoints = {
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

  // Admin/Moderation
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

// Rating endpoints
export const ratingEndpoints = {
  ratePost: (postId, value) => api.post('/api/ratings/', {
    post: postId,
    value: Math.min(Math.max(value, 1), 5)
  }),
  getRating: (postId) => api.get(`/api/ratings/${postId}/`),
};

// Followers endpoints
export const followerEndpoints = {
  followUser: (followedId) => api.post('/api/followers/follow/', { followed: followedId }),
  unfollowUser: (followedId) => api.delete('/api/followers/follow/', { data: { followed: followedId } }),
  getFollowers: (userId) => api.get(`/api/followers/${userId}/`),
  getPopularFollowers: (userId) => api.get(`/api/followers/${userId}/popular-followers/`),
};

// Notification endpoints
export const notificationEndpoints = {
  getNotifications: () => api.get('/api/notifications/'),
  markAsRead: (notificationId) => api.patch(`/api/notifications/${notificationId}/mark-read/`),
  markAllAsRead: () => api.patch('/api/notifications/mark-all-read/'),
  deleteNotification: (notificationId) => api.delete(`/api/notifications/${notificationId}/delete/`),
};

// Settings endpoints
export const settingsEndpoints = {
  updateProfile: (userData) => multipartApi.put('/api/profiles/current/', userData),
  updateProfileName: (userId, data) => api.patch(`/api/profiles/${userId}/`, data),
  uploadProfilePicture: (formData) => multipartApi.post('/api/accounts/upload-profile-picture/', formData),

  updateEmail: (email) => api.put('/api/accounts/update-email/', { email }),
  deleteAccount: () => api.post('/api/accounts/delete-account/'),

  resetPassword: (email) => api.post('/api/accounts/password-reset/', { email }),
  confirmPasswordReset: (data) => api.post('/api/accounts/password-reset/confirm/', data),

  setupTwoFactor: authEndpoints.setupTwoFactor,
  confirmTwoFactor: authEndpoints.confirmTwoFactor,
  cancelTwoFactorSetup: authEndpoints.cancelTwoFactorSetup,
  verifyTwoFactor: authEndpoints.verifyTwoFactor,

  getNotificationSettings: () => api.get('/api/notifications/settings/'),
  updateNotificationSettings: (settings) => api.put('/api/notifications/settings/', settings),
};
