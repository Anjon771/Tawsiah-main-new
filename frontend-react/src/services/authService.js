import api from './api';

export const register = (data) => api.post('/tawsiah/auth/register', data);
export const login = (data) => api.post('/tawsiah/auth/login', data);
export const logout = () => api.post('/tawsiah/auth/logout');
