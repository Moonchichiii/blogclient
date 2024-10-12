import { api, multipartApi } from './apiConfig';

// Accounts endpoints

export const authEndpoints = {
  login: (credentials) => api.post('/api/accounts/login/', credentials),
  register: (userData) => api.post('/api/accounts/register/', userData),
  confirmEmail: (uidb64, token) => api.get(`/api/accounts/activate/${uidb64}/${token}/`),
  logout: () => api.post('/api/accounts/logout/'),  
  resendVerification: (email) => api.post('/api/accounts/resend-verification/', { email }),
  setupTwoFactor: () => api.post('api/accounts/setup-2fa/'),
  getTwoFactorStatus: () => api.get('api/accounts/two-factor/status/'),
  refreshToken: (refreshToken) => api.post('/api/accounts/token/refresh/', { refresh: refreshToken }),

};


// Profiles endpoints
export const userEndpoints = {
  getCurrentUser: () => api.get('/api/accounts/current-user/'),
  updateProfile: (userData) => multipartApi.put('/api/profiles/profile/', userData),
  uploadProfilePicture: (formData) => multipartApi.post('/api/profiles/upload-profile-picture/', formData),
  getPopularFollowers: (userId) => api.get(`/api/profiles/${userId}/popular-followers/`),
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
  ratePost: (id, rating) => api.post(`/api/ratings/rate/`, { post: id, value: rating }),
  // Approve and Disapprove endpoints
  getUnapprovedPosts: () => api.get('/api/posts/unapproved/'),
  approvePost: (id) => api.post(`/api/posts/${id}/approve/`),
  disapprovePost: (id, reason) => api.post(`/api/posts/${id}/disapprove/`, { reason }),
};

// Comment endpoints
export const commentEndpoints = {
  getComments: (postId) => api.get(`/api/posts/${postId}/comments/`),
  createComment: (postId, commentData) => api.post(`/api/posts/${postId}/comments/`, commentData),
  updateComment: (commentId, commentData) => api.put(`/api/comments/${commentId}/`, commentData),
  deleteComment: (commentId) => api.delete(`/api/comments/${commentId}/`),
};

// Rating endpoints
export const ratingEndpoints = {
  ratePost: (postId, value) => api.post('/api/ratings/rate/', { post: postId, value }),
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

// Follower endpoints
export const followerEndpoints = {
  followUser: (followedId) => api.post('/api/followers/follow/', { followed: followedId }),
  unfollowUser: (followedId) => api.delete('/api/followers/follow/', { data: { followed: followedId } }),
  getFollowers: (userId) => api.get(`/api/followers/${userId}/`),
};
