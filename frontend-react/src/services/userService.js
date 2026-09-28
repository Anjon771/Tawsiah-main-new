import api from './api';

export const getAllUsers = () => api.get('/tawsiah/users');
export const getProfile = (id) => api.get('/api/v1/profile/' + id);
export const suspendUser = (id, days) =>
  api.put(`/tawsiah/users/${id}/suspend?days=${days}`);
export const banUser = (id) => api.put(`/tawsiah/users/${id}/ban`);
export const unblockUser = (id) => api.put(`/tawsiah/users/${id}/unblock`);

export const updateProfileName = (id, name) =>
  api.put(`/api/v1/profile/${id}/name`, { name });

export const updateProfileAvatar = (id, avatarBase64) =>
  api.post(`/api/v1/profile/${id}/avatar`, { avatarBase64 });
