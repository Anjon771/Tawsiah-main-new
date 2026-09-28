import api from './api';

export const getAllEvents = () => api.get('/event');
export const getEventById = (id) => api.get(`/event/${id}`);
export const createEvent = (data) => api.post('/event', data);
export const updateEvent = (id, data) => api.put(`/event/${id}`, data);
export const deleteEvent = (id) => api.delete(`/event/${id}`);
