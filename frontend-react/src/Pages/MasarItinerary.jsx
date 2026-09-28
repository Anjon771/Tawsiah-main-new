import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  BsArrowLeft,
  BsCheckCircle,
  BsCart3,
  BsGeoAlt,
  BsTag,
  BsCashCoin,
  BsStarFill,
} from 'react-icons/bs'
import { useOrder } from '../contexts/OrderContext'
import EmptyState from '../components/EmptyState'
import LoadingButton from '../components/ui/LoadingButton'

function parsePrice(priceDisplay) {
  if (!priceDisplay || priceDisplay.toLowerCase() === 'free') return 0
  const cleaned = String(priceDisplay).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

function MasarItinerary() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToOrder } = useOrder()

  const state = location.state || {}
  const {
    budget,
    selectedCities = [],
    selectedCategories = [],
    items = [],
    estimatedTotalCost,
  } = state

  const [selectedIds, setSelectedIds] = useState(new Set())
  const [startLoading, setStartLoading] = useState(false)

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.placeId)),
    [items, selectedIds]
  )

  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + parsePrice(item.priceDisplay), 0)
  }, [selectedItems])

  const handleStartJourney = async () => {
    if (selectedItems.length === 0) {
      toast.info('Please select at least one item to include in your journey')
      return
    }

    setStartLoading(true)

    // Add each selected item to the order
    for (const item of selectedItems) {
      const price = parsePrice(item.priceDisplay)
      const priceStr = price.toFixed(2)

      addToOrder({
        place: {
          id: item.placeId,
          name: item.name,
          imageUrl: item.imageUrl,
          rate: item.rate,
          schedule: item.schedule || { date: '', startAt: '', endAt: '' },
          city: item.city,
          category: item.category,
        },
        tickets: { adult: 1, kids: 0 },
        pricing: {
          pricePerAdult: price,
          pricePerKid: 0,
          adultTotal: price,
          kidsTotal: 0,
          total: priceStr,
        },
      })
    }

    toast.success(`${selectedItems.length} items added to your order!`)
    navigate('/order')
    setStartLoading(false)
  }

  if (!items || items.length === 0) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<BsCart3 size={48} color="var(--color-text-muted)" />}
          title="No itinerary items"
          subtitle="We couldn't find any places or events matching your criteria."
          actionLabel="Back to Masar"
          onAction={() => navigate('/masar')}
        />
      </Container>
    )
  }

  return (
    <>
      <Container className="py-4" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h2
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Your Generated Itinerary
          </h2>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
            {items.length} matching places and events found within your budget.
          </p>

          <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
            <Badge
              bg="light"
              text="dark"
              style={{
                fontSize: 'var(--font-size-sm)',
                border: '1px solid var(--color-border)',
                padding: '6px 12px',
              }}
            >
              <BsCashCoin style={{ marginRight: '4px' }} />
              Budget: {budget} SAR
            </Badge>
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
            {estimatedTotalCost != null && (
              <Badge
                bg="success"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  padding: '6px 12px',
                  background: 'var(--color-primary)',
                }}
              >
                <BsCashCoin style={{ marginRight: '4px' }} />
                Est. Total: {estimatedTotalCost.toFixed(2)} SAR
              </Badge>
            )}
          </div>
        </div>

        {/* Item Grid */}
        <Row className="g-4">
          {items.map((item) => {
            const selected = selectedIds.has(item.placeId)
            return (
              <Col key={item.placeId} xs={12} md={6} lg={4}>
                <Card
                  className="h-100"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: selected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                    boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => toggleItem(item.placeId)}
                >
                  <div style={{ position: 'relative' }}>
                    <Card.Img
                      variant="top"
                      src={item.imageUrl || 'https://placehold.co/400x250'}
                      style={{
                        height: '180px',
                        objectFit: 'cover',
                        filter: selected ? 'brightness(0.92)' : 'none',
                        transition: 'filter var(--transition-fast)',
                      }}
                    />
                    {/* Selection overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: selected ? 'var(--color-primary)' : 'rgba(255,255,255,0.85)',
                        border: selected ? 'none' : '2px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {selected && <BsCheckCircle size={18} color="#fff" />}
                    </div>
                  </div>

                  <Card.Body style={{ padding: 'var(--space-4)' }}>
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        bg="light"
                        text="dark"
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          border: '1px solid var(--color-border)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {item.city}
                      </Badge>
                      <Badge
                        bg="success"
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          background: 'var(--color-primary)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {item.category}
                      </Badge>
                      <span
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: '#FFC107',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <BsStarFill />
                        {item.rate?.toFixed?.(1) ?? item.rate ?? 'N/A'}
                      </span>
                    </div>

                    <Card.Title
                      style={{
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      {item.name}
                    </Card.Title>

                    <Card.Text
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 'var(--line-height-relaxed)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {item.priceDisplay === 'Free' || item.priceDisplay === '0.00'
                          ? 'Free'
                          : `${item.priceDisplay} SAR`}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const route =
                            item.type === 'event'
                              ? `/event/${item.placeId}`
                              : `/place/${item.placeId}`
                          navigate(route, { state: { place: item } })
                        }}
                        style={{
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>

      {/* Sticky Bottom Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border-subtle)',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
          padding: 'var(--space-4) var(--space-5)',
          zIndex: 'var(--z-dropdown)',
        }}
      >
        <Container
          className="d-flex justify-content-between align-items-center flex-wrap gap-3"
          style={{ maxWidth: '1200px' }}
        >
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate('/masar')}
              style={{
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <BsArrowLeft style={{ marginRight: '6px' }} />
              Back
            </Button>

            <div>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <strong style={{ color: 'var(--color-text-primary)' }}>
                  {selectedItems.length}
                </strong>{' '}
                {selectedItems.length === 1 ? 'item' : 'items'} selected
              </span>
              {selectedItems.length > 0 && (
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Est. Total: {selectedTotal.toFixed(2)} SAR
                </div>
              )}
            </div>
          </div>

          <LoadingButton
            loading={startLoading}
            loadingText="Adding to order..."
            variant="success"
            onClick={handleStartJourney}
            disabled={selectedItems.length === 0}
            className="btn-primary-custom"
            style={{
              opacity: selectedItems.length === 0 ? 0.6 : 1,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <BsCart3 style={{ marginRight: '8px' }} />
            Start Journey
          </LoadingButton>
        </Container>
      </div>
    </>
  )
}

export default MasarItinerary
