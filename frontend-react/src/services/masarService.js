import api from './api'

export const getMasarDiscovery = () => api.get('/api/v1/masar/discovery')

export const getMasarItinerary = (data) => api.post('/api/v1/masar/itinerary', data)

export const generateMasar = (data) => api.post('/api/v1/masar/generate', data)
