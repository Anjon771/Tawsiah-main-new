import api from './api'

export const buildPreferenceList = (interests, favorites, viewedEvents) => {
  const categoryScore = {}

  // Interests — weight 1 (only category-type interests; skip cities)
  interests.forEach(interest => {
    const type = interest.type || 'category'
    if (type !== 'category') return
    const cat = interest.name?.toLowerCase()
    if (cat) categoryScore[cat] = (categoryScore[cat] || 0) + 1
  })

  // Favorites — weight 3 (strongest signal)
  favorites.forEach(place => {
    const cat = place.category?.toLowerCase()
    if (cat) categoryScore[cat] = (categoryScore[cat] || 0) + 3
  })

  // Viewed — weight 1.5
  viewedEvents.forEach(place => {
    const cat = place.category?.toLowerCase()
    if (cat) categoryScore[cat] = (categoryScore[cat] || 0) + 1.5
  })

  return Object.entries(categoryScore)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)
}

export const extractCities = (interests) => {
  return interests
    .filter(i => (i.type || 'category') === 'city')
    .map(i => i.name)
}

export const getUserCity = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    if (profile?.city) return profile.city
  } catch { /* ignore */ }
  return localStorage.getItem('userCity') || null
}

export const getRecommendations = (userId, categories, cities = [], city = null) =>
  api.post('/api/recommendations', {
    userId,
    categories,
    cities,
    city,
    limit: 10
  })

export const syncProfile = (userId, interests, sessionCategories) =>
  api.post('/api/recommendations/sync', {
    userId,
    interests: interests
      .filter(i => (i.type || 'category') === 'category')
      .map(i => i.name),
    cities: interests
      .filter(i => (i.type || 'category') === 'city')
      .map(i => i.name),
    sessionCategories
  })
