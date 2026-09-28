import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { filterPlaces, filterEvents } from '../services/placeService';
import FilterBar from '../components/FilterBar';
import ExploreCard from '../components/ExploreCard';
import SkeletonGrid from '../components/ui/SkeletonGrid';
import { EmptyStateSearch } from '../components/ui/EmptyStates';
import { toast } from 'react-toastify';

function transformPlaceFromFilter(place) {
  if (!place) return null;
  return {
    id: place.id,
    name: place.name,
    description: place.description || '',
    category: place.category || '',
    city: place.city || '',
    price: place.price != null ? String(place.price) : '',
    rate: place.rate || 0,
    imageUrl: place.imageURL || place.imageUrl || '',
    type: 'place',
  };
}

function transformEventFromFilter(event) {
  if (!event) return null;
  return {
    id: event.id,
    name: event.name,
    description: event.description || '',
    category: event.category || '',
    city: event.city || '',
    price: event.price || '',
    rate: event.rate || 0,
    imageUrl: event.imageUrl || event.imageURL || '',
    type: 'event',
  };
}

export default function Explore() {
  const [searchParams] = useSearchParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [currentFilters, setCurrentFilters] = useState({
    search: '',
    category: (searchParams.get('type') || '').toLowerCase(),
    city: searchParams.get('city') || '',
    minRating: '',
    priceType: '',
    sortBy: 'rate',
    sortDir: 'desc',
  });

  // Initial load — apply URL params
  useEffect(() => {
    handleFilter(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      const [placesRes, eventsRes] = await Promise.all([
        filterPlaces(filters),
        filterEvents(filters),
      ]);

      const places = (placesRes.data || []).map(transformPlaceFromFilter);
      const events = (eventsRes.data || []).map(transformEventFromFilter);

      const combined = [...events, ...places];
      setResults(combined);
      setTotalResults(combined.length);
    } catch (err) {
      console.error('Filter error:', err);
      setError('Failed to load results — please try again');
      toast.error('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Container className="py-5">
      {/* Header */}
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-5)',
        }}
      >
        Explore Places
      </h3>

      {/* Filter Bar */}
      <FilterBar onFilter={handleFilter} loading={loading} />

      {/* Results Count */}
      {!loading && (
        <p
          style={{
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {totalResults} {totalResults === 1 ? 'place' : 'places'} found
        </p>
      )}

      {/* Loading Skeleton */}
      {loading && <SkeletonGrid count={6} columns={3} />}

      {/* Error */}
      {error && (
        <div className="py-5">
          <EmptyStateSearch onAction={() => handleFilter(currentFilters)} />
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <Row>
          {results.map((place) => (
            <Col md={12} key={`${place.type}-${place.id}`}>
              <ExploreCard place={place} />
            </Col>
          ))}
        </Row>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <div className="py-5">
          <EmptyStateSearch onAction={() => handleFilter({ ...currentFilters, search: '', category: '', city: '' })} />
        </div>
      )}
    </Container>
  );
}
