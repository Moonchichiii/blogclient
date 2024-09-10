import { api, multipartApi } from './apiConfig';

export const getPosts = () => api.get('/api/posts/');
export const getPost = (id) => api.get(`/api/posts/${id}/`);
export const createPost = (postData) => multipartApi.post('/api/posts/', postData);
export const updatePost = (id, postData) => multipartApi.put(`/api/posts/${id}/`, postData);
export const deletePost = (id) => api.delete(`/api/posts/${id}/`);
export const ratePost = (id, rating) => api.post(`/api/ratings/rate/`, { post: id, value: rating });