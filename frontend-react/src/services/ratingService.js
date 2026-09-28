import api from './api';

export const addRating = (data) => api.post('/ratings', {
  eventId: data.eventId,
  rating: data.rating,
  comment: data.comment || '',
  userName: data.userName || '',
  userID: data.userID || null,
});
export const getRatingsByEvent = (eventId) => api.get(`/ratings/${eventId}`);
export const deleteRating = (id) => api.delete(`/ratings/${id}`);
