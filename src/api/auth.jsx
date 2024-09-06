import { api } from './apiConfig';

export const login = (credentials) => api.post('/api/accounts/login/', credentials);
export const register = (userData) => api.post('/api/accounts/register/', userData);
export const logout = () => api.post('/api/accounts/logout/');
export const confirmEmail = (uidb64, token) => api.get(`/api/accounts/activate/${uidb64}/${token}/`);