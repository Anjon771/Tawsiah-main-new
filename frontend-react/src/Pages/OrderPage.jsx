import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { BsCart } from 'react-icons/bs'
import { HiOutlineCalendarDateRange } from 'react-icons/hi2'
import { IoTimeOutline } from 'react-icons/io5'
import PlaceRate from '../components/PlaceRate'
import LoadingButton from '../components/ui/LoadingButton'
import { useOrder } from '../contexts/OrderContext'
import EmptyState from '../components/EmptyState'
import { toast } from 'react-toastify'

function OrderPage() {
  const { orderItems, removeFromOrder, clearOrder, getTotalPrice } = useOrder()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [clearing, setClearing] = useState(false)

  if (orderItems.length === 0) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<BsCart size={48} color="var(--color-text-muted)" />}
          title="No events in your order"
          subtitle="Browse places and add tickets to your order."
          actionLabel="Browse Events"
          onAction={() => navigate('/explore')}
        />
      </Container>
    )
  }

  const handleRemove = (placeId) => {
    removeFromOrder(placeId)
    toast.info('Ticket removed from order')
  }

  const handleClear = () => {
    setClearing(true)
    clearOrder()
    toast.success('Order cleared')
    setClearing(false)
  }

  const handleConfirm = () => {
    setConfirming(true)
    clearOrder()
    toast.success('Order confirmed! Enjoy your trip.')
    navigate('/home')
  }

  return (
    <Container className="py-5">
      <h2
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        Order Summary
      </h2>

      {orderItems.map((item, index) => (
        <div key={item.place.id} className="mb-4">
          <Row className="mb-3">
            <Col md={4}>
              <Image
                src={item.place.imageUrl || 'https://placehold.co/400x300'}
                alt={item.place.name}
                fluid
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-lg)',
                }}
              />
            </Col>

            <Col md={8}>
              <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                {item.place.name}
              </h4>
              <PlaceRate rate={item.place.rate} />

              <div className="d-flex align-items-center gap-2 mt-2" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                <HiOutlineCalendarDateRange size={20} style={{ color: 'var(--color-primary)' }} />
                <span>{item.place.schedule?.date || 'Date not specified'}</span>
              </div>

              <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                <IoTimeOutline size={20} style={{ color: 'var(--color-primary)' }} />
                <span>
                  {item.place.schedule?.startAt || '--'} - {item.place.schedule?.endAt || '--'}
                </span>
              </div>

              <div className="mt-3" style={{ fontSize: 'var(--font-size-sm)' }}>
                {(item.tickets?.adult || 0) > 0 && (
                  <div className="d-flex justify-content-between" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Adult x{item.tickets?.adult || 0}</span>
                    <span>${(item.pricing?.adultTotal ?? parseFloat(item.pricing?.total || 0)).toFixed(2)}</span>
                  </div>
                )}
                {(item.tickets?.kids || 0) > 0 && (
                  <div className="d-flex justify-content-between" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Kids x{item.tickets?.kids || 0}</span>
                    <span>${(item.pricing?.kidsTotal || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-1">
                  <strong style={{ color: 'var(--color-text-primary)' }}>Subtotal</strong>
                  <strong style={{ color: 'var(--color-primary)' }}>${item.pricing?.total || '0.00'}</strong>
                </div>
              </div>

              <Button
                variant="outline-danger"
                size="sm"
                className="mt-3"
                onClick={() => handleRemove(item.place.id)}
              >
                Remove Event
              </Button>
            </Col>
          </Row>

          {index < orderItems.length - 1 && <hr style={{ borderColor: 'var(--color-border-subtle)' }} />}
        </div>
      ))}

      <hr style={{ borderColor: 'var(--color-border-subtle)' }} />

      <div className="d-flex justify-content-between mb-4">
        <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
          Grand Total
        </h4>
        <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
          ${getTotalPrice()}
        </h4>
      </div>

      <div className="d-flex gap-3 flex-wrap">
        <button className="btn-outline-custom" onClick={() => navigate('/explore')}>
          Back to Explore
        </button>

        <LoadingButton
          loading={clearing}
          loadingText="Clearing..."
          className="btn-danger-custom"
          onClick={handleClear}
        >
          Clear All
        </LoadingButton>

        <LoadingButton
          loading={confirming}
          loadingText="Confirming..."
          className="btn-primary-custom"
          onClick={handleConfirm}
        >
          Confirm Order
        </LoadingButton>
      </div>
    </Container>
  )
}

export default OrderPage
