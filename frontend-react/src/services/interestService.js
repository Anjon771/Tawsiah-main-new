import api from './api';

export const getAllInterests = () => api.get('/tawsiah/interests');

export const saveUserInterests = (userId, interestIds) =>
  api.post(`/tawsiah/users/${userId}/interests`, interestIds);
