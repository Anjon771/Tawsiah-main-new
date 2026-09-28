import api from './api';

export const getProfile = (userId) => api.get(`/api/v1/profile/${userId}`);
