import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  BsCompass,
  BsTree,
  BsWater,
  BsTriangle,
  BsBuilding,
  BsCalendarEvent,
  BsStars,
  BsArrowRight,
  BsArrowLeft,
  BsCheckCircle,
  BsGeoAlt,
  BsTag,
} from 'react-icons/bs'
import { getMasarDiscovery, getMasarItinerary } from '../services/masarService'
import LoadingButton from '../components/ui/LoadingButton'
import SkeletonGrid from '../components/ui/SkeletonGrid'
import EmptyState from '../components/EmptyState'

const CATEGORY_ICONS = {
  beach: <BsWater size={24} />,
  nature: <BsTree size={24} />,
  mountains: <BsTriangle size={24} />,
  historical: <BsBuilding size={24} />,
  festivals: <BsCalendarEvent size={24} />,
  other: <BsStars size={24} />,
}

function MasarWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState(500)

  const [discoveryLoading, setDiscoveryLoading] = useState(false)
  const [discoveryError, setDiscoveryError] = useState('')
  const [allCategories, setAllCategories] = useState([])
  const [allCities, setAllCities] = useState([])

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedCities, setSelectedCities] = useState([])

  const [loading, setLoading] = useState(false)

  // Fetch discovery data on mount for Step 2
  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        setDiscoveryLoading(true)
        setDiscoveryError('')
        const res = await getMasarDiscovery()
        setAllCategories(res.data.categories || [])
        setAllCities(res.data.cities || [])
      } catch (err) {
        console.error('Failed to load discovery data:', err)
        setDiscoveryError('Failed to load categories and cities. Please try again.')
        toast.error('Failed to load categories and cities.')
      } finally {
        setDiscoveryLoading(false)
      }
    }
    fetchDiscovery()
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  const handleGenerate = async () => {
    if (selectedCategories.length === 0 && selectedCities.length === 0) {
      toast.info('Please select at least one city or category')
      return
    }

    setStep(3)
    setLoading(true)
    try {
      const res = await getMasarItinerary({
        budget: Number(budget),
        interests: selectedCategories,
        cities: selectedCities,
      })

      const data = res.data
      if (data.items && data.items.length > 0) {
        navigate('/masar/itinerary', {
          state: {
            budget: Number(budget),
            selectedCities,
            selectedCategories,
            items: data.items,
            estimatedTotalCost: data.estimatedTotalCost,
          },
        })
      } else {
        toast.warn('No matches found. Try adjusting your filters.')
        setStep(2)
      }
    } catch (err) {
      console.error('Itinerary generation failed:', err)
      toast.error('Failed to generate itinerary. Please try again.')
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  // ── Step 1: Budget ──
  if (step === 1) {
    return (
      <Container className="py-5" style={{ maxWidth: '720px' }}>
        <div className="text-center mb-5">
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <BsCompass size={36} color="var(--color-primary)" />
          </div>
          <h2
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Plan Your Journey
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
            Tell us your budget and interests, and we will craft the perfect Saudi itinerary for you.
          </p>
        </div>

        <div
          className="p-4 p-md-5"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}
            >
              What is your estimated budget? (SAR)
            </label>
            <div className="d-flex align-items-center gap-3 mb-2">
              <input
                type="number"
                min={50}
                max={50000}
                value={budget}
                onChange={(e) => setBudget(Math.max(50, Number(e.target.value)))}
                className="form-control"
                style={{
                  maxWidth: '200px',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--color-border)',
                }}
              />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                SAR
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="form-range"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <div className="d-flex justify-content-between mt-1">
              <small style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                100 SAR
              </small>
              <small style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                10,000 SAR
              </small>
            </div>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-3)',
              }}
            >
              Enter your total estimated budget for this trip. This helps us curate places and events
              that fit your spending plan.
            </p>
          </div>

          <div className="d-flex justify-content-end">
            <Button className="btn-primary-custom" onClick={() => setStep(2)}>
              Next <BsArrowRight style={{ marginLeft: '6px' }} />
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  // ── Step 2: Unified Interests (Categories + Cities) ──
  if (step === 2) {
    return (
      <Container className="py-5" style={{ maxWidth: '960px' }}>
        <div className="text-center mb-4">
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <BsTag size={36} color="var(--color-primary)" />
          </div>
          <h2
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Select Your Interests
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
            Choose the cities you want to visit and the experiences you are looking for.
          </p>

          {/* Summary chips */}
          <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
            {selectedCities.length > 0 && (
              <Badge
                bg="light"
                text="dark"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  border: '1px solid var(--color-border)',
                  padding: '6px 12px',
                }}
              >
                <BsGeoAlt style={{ marginRight: '4px' }} />
                {selectedCities.length} {selectedCities.length === 1 ? 'city' : 'cities'}
              </Badge>
            )}
            {selectedCategories.length > 0 && (
              <Badge
                bg="light"
                text="dark"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  border: '1px solid var(--color-border)',
                  padding: '6px 12px',
                }}
              >
                <BsTag style={{ marginRight: '4px' }} />
                {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
              </Badge>
            )}
          </div>
        </div>

        {discoveryLoading && <SkeletonGrid count={12} columns={4} />}

        {discoveryError && (
          <EmptyState
            icon={<BsCompass size={48} color="var(--color-text-muted)" />}
            title="Could not load options"
            subtitle={discoveryError}
            actionLabel="Retry"
            onAction={() => window.location.reload()}
          />
        )}

        {!discoveryLoading && !discoveryError && (
          <div
            className="p-4 p-md-5"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Categories Section */}
            <div className="mb-5">
              <h4
                className="fw-semibold mb-3"
                style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}
              >
                Experience Types
              </h4>
              <Row className="g-3">
                {allCategories.map((cat) => {
                  const selected = selectedCategories.includes(cat)
                  const icon = CATEGORY_ICONS[cat] || <BsStars size={24} />
                  return (
                    <Col key={cat} xs={6} sm={4} md={3}>
                      <div
                        onClick={() => toggleCategory(cat)}
                        className="text-center p-3 rounded-3 border"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                          background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                          boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                          transform: selected ? 'translateY(-2px)' : 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: selected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            marginBottom: 'var(--space-2)',
                          }}
                        >
                          {icon}
                        </div>
                        <div
                          className="fw-medium text-capitalize"
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            color: selected ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
                          }}
                        >
                          {cat}
                        </div>
                        {selected && (
                          <Badge
                            bg="success"
                            className="mt-2"
                            style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-primary)' }}
                          >
                            <BsCheckCircle style={{ marginRight: '4px' }} />
                            Selected
                          </Badge>
                        )}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </div>

            {/* Cities Section */}
            <div className="mb-4">
              <h4
                className="fw-semibold mb-3"
                style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}
              >
                Cities
              </h4>
              <Row className="g-3">
                {allCities.map((city) => {
                  const selected = selectedCities.includes(city)
                  return (
                    <Col key={city} xs={6} sm={4} md={3} lg={2}>
                      <div
                        onClick={() => toggleCity(city)}
                        className="text-center p-3 rounded-3 border"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                          background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                          boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                          transform: selected ? 'translateY(-2px)' : 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: selected ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            marginBottom: 'var(--space-2)',
                          }}
                        >
                          <BsGeoAlt size={24} />
                        </div>
                        <div
                          className="fw-medium text-capitalize"
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            color: selected ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
                          }}
                        >
                          {city}
                        </div>
                        {selected && (
                          <Badge
                            bg="success"
                            className="mt-2"
                            style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-primary)' }}
                          >
                            <BsCheckCircle style={{ marginRight: '4px' }} />
                            Selected
                          </Badge>
                        )}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => setStep(1)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <BsArrowLeft style={{ marginRight: '6px' }} />
                Back
              </Button>
              <LoadingButton
                loading={loading}
                loadingText="Generating..."
                variant="success"
                onClick={handleGenerate}
                className="btn-primary-custom"
              >
                Generate My Trip
              </LoadingButton>
            </div>
          </div>
        )}
      </Container>
    )
  }

  // ── Step 3: Loading ──
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '60vh' }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          width: '64px',
          height: '64px',
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-4)',
        }}
      />
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Building your perfect journey...
      </h3>
      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
        Matching places and events to your budget and interests.
      </p>
    </Container>
  )
}

export default MasarWizard
