import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsLock, BsExclamationTriangle, BsBullseye } from 'react-icons/bs';
import ExploreCard from '../components/ExploreCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { useUser } from '../contexts/UserContext';
import { buildPreferenceList, extractCities, getRecommendations, getUserCity } from '../services/recommendationService';

export default function Recommendations() {
  const { user, interests, favorites, viewedEvents } = useUser();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [strategy, setStrategy] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const preferenceList = buildPreferenceList(interests, favorites, viewedEvents);
        const userCities = extractCities(interests);

        const userCity = getUserCity();
        const res = await getRecommendations(user.id, preferenceList, userCities, userCity);
        const data = res.data?.events || res.data?.scoredItems || [];
        setRecommended(data);
        setStrategy(res.data?.strategy || '');
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, interests, favorites, viewedEvents]);

  if (loading) {
    return (
      <Container className="py-5">
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
        {[1, 2, 3].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<BsLock size={48} color="var(--color-text-muted)" />}
          title="Recommendations"
          subtitle="Please log in to see personalized recommendations."
          actionLabel="Log In"
          onAction={() => navigate('/login')}
        />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Recommended for You
      </h3>
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        Personalized places and events based on your interests and browsing history
      </p>

      {error && (
        <EmptyState
          icon={<BsExclamationTriangle size={48} color="var(--color-text-muted)" />}
          title="Something went wrong"
          subtitle={error}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      )}

      {!error && (
        <>
          {strategy && (
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-1)',
              }}
            >
              {strategyLabel(strategy)}
            </p>
          )}
          <p
            style={{
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {recommended.length} {recommended.length === 1 ? 'recommendation' : 'recommendations'} found
          </p>

          <Row>
            {recommended.map((place, idx) => (
              <Col md={12} key={`${place.type || 'item'}-${place.id}-${idx}`}>
                <ExploreCard place={place} />
              </Col>
            ))}
          </Row>

          {recommended.length === 0 && (
            <EmptyState
              icon={<BsBullseye size={48} color="var(--color-text-muted)" />}
              title="No recommendations yet"
              subtitle="Explore more places or set your interests to get personalized suggestions."
              actionLabel="Explore Places"
              onAction={() => navigate('/explore')}
            />
          )}
        </>
      )}
    </Container>
  );
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
