import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { buildPreferenceList, getRecommendations, getUserCity, extractCities } from '../services/recommendationService'
import { BsBullseye } from 'react-icons/bs'
import PlaceCard from './home/PlaceCard'
import SkeletonCard from './SkeletonCard'
import EmptyState from './EmptyState'

function RecommendedSection() {
  const { user, interests, favorites, viewedEvents } = useUser()
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [strategy, setStrategy] = useState('')

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const preferenceList = buildPreferenceList(interests, favorites, viewedEvents)
        const userCities = extractCities(interests)
        const userCity = getUserCity()
        const res = await getRecommendations(user?.id, preferenceList, userCities, userCity)
        setRecommended(res.data?.scoredItems || res.data?.events || [])
        setStrategy(res.data?.strategy || '')
      } catch (err) {
        console.error('Recommendations unavailable:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [interests, favorites])

  if (loading) {
    return (
      <div className="px-3 px-md-5">
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Recommended for You
        </h3>
        <div className="places-grid">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    )
  }

  if (recommended.length === 0) {
    return (
      <div className="px-3 px-md-5">
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Recommended for You
        </h3>
        <EmptyState
          icon={<BsBullseye size={48} color="var(--color-text-muted)" />}
          title="No recommendations yet"
          subtitle="Add interests or favorite places to get personalized recommendations."
        />
      </div>
    )
  }

  return (
    <div className="px-3 px-md-5">
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-1)',
        }}
      >
        Recommended for You
      </h3>
      {strategy && (
        <p
          className="mb-4"
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {strategyLabel(strategy)}
        </p>
      )}
      <div className="places-grid">
        {recommended.map((event) => (
          <PlaceCard key={event.id} place={event} />
        ))}
      </div>
    </div>
  )
}

const STRATEGY_LABELS = {
  hybrid_city_category: 'Personalized by city & interests',
  city_based: 'Picks near your city',
  category_based: 'Based on your interests',
  top_rated_fallback: 'Top-rated in Saudi Arabia',
  proximity_fallback: 'Nearby recommendations',
}

function strategyLabel(strategy) {
  return STRATEGY_LABELS[strategy] || 'Personalized for you'
}

export default RecommendedSection
