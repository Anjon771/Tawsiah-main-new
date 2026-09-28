import api from './api';

export const getAllPlaces = () => api.get('/place');
export const getPlaceById = (id) => api.get(`/place/${id}`);
export const createPlace = (data) => api.post('/place', data);
export const updatePlace = (id, data) => api.put(`/place/${id}`, data);
export const deletePlace = (id) => api.delete(`/place/${id}`);

export const filterPlaces = (filters) => {
  const params = {}
  if (filters.category)  params.category  = filters.category
  if (filters.city)      params.city      = filters.city
  if (filters.minRating) params.minRating = filters.minRating
  if (filters.priceType) params.priceType = filters.priceType
  if (filters.search)    params.search    = filters.search
  if (filters.sortBy)    params.sortBy    = filters.sortBy
  if (filters.sortDir)   params.sortDir   = filters.sortDir

  return api.get('/place/filter', { params })
}

export const filterEvents = (filters) => {
  const params = {}
  if (filters.category)  params.category = filters.category
  if (filters.city)      params.city     = filters.city
  if (filters.minRating) params.minRating = filters.minRating
  if (filters.search)    params.search   = filters.search

  return api.get('/event/filter', { params })
}
