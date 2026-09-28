import api from './api';

export const search = (query) => api.get('/api/search', { params: { q: query } });
