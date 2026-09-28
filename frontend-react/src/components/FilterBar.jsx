import { useState } from 'react'
import { Row, Col, Form, Button, Badge } from 'react-bootstrap'

const CATEGORIES = ['beach', 'nature', 'mountains', 'historical', 'festivals', 'other']
const CITIES = ['Riyadh', 'Jeddah', 'Abha', 'Taif', 'Medina', 'Al Ula', 'Tabuk', 'Jizan', 'Hail', 'Najran']
const SORT_OPTIONS = [
  { value: 'rate',  label: 'Top Rated' },
  { value: 'name',  label: 'Name A-Z' },
  { value: 'price', label: 'Price' },
]

function FilterBar({ onFilter, loading }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minRating: '',
    priceType: '',
    sortBy: 'rate',
    sortDir: 'desc'
  })

  const [activeFilters, setActiveFilters] = useState([])

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    const active = []
    if (filters.category) active.push({ key: 'category', label: filters.category })
    if (filters.city)     active.push({ key: 'city',     label: filters.city })
    if (filters.minRating) active.push({ key: 'minRating', label: `${filters.minRating}+ stars` })
    if (filters.priceType) active.push({ key: 'priceType', label: filters.priceType })
    setActiveFilters(active)

    onFilter(filters)
  }

  const handleReset = () => {
    const reset = {
      search: '', category: '', city: '',
      minRating: '', priceType: '',
      sortBy: 'rate', sortDir: 'desc'
    }
    setFilters(reset)
    setActiveFilters([])
    onFilter(reset)
  }

  const removeFilter = (key) => {
    const updated = { ...filters, [key]: '' }
    setFilters(updated)
    setActiveFilters(prev => prev.filter(f => f.key !== key))
    onFilter(updated)
  }

  const inputStyle = {
    borderColor: 'var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    fontSize: 'var(--font-size-base)',
  }

  return (
    <div className="mb-4">
      {/* Search Row */}
      <Row className="g-2 mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search places, cities, descriptions..."
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            style={inputStyle}
          />
        </Col>
        <Col md={2}>
          <Button
            variant="success"
            className="w-100"
            onClick={handleApply}
            disabled={loading}
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={handleReset}
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {/* Filter Row */}
      <Row className="g-2 mb-3">
        {/* Category */}
        <Col md={3}>
          <Form.Select
            value={filters.category}
            onChange={e => handleChange('category', e.target.value)}
            style={inputStyle}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* City */}
        <Col md={3}>
          <Form.Select
            value={filters.city}
            onChange={e => handleChange('city', e.target.value)}
            style={inputStyle}
          >
            <option value="">All Cities</option>
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Form.Select>
        </Col>

        {/* Min Rating */}
        <Col md={2}>
          <Form.Select
            value={filters.minRating}
            onChange={e => handleChange('minRating', e.target.value)}
            style={inputStyle}
          >
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </Form.Select>
        </Col>

        {/* Price Type */}
        <Col md={2}>
          <Form.Select
            value={filters.priceType}
            onChange={e => handleChange('priceType', e.target.value)}
            style={inputStyle}
          >
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Form.Select>
        </Col>

        {/* Sort */}
        <Col md={2}>
          <Form.Select
            value={filters.sortBy}
            onChange={e => handleChange('sortBy', e.target.value)}
            style={inputStyle}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Active Filter Badges */}
      {activeFilters.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          <span className="text-muted small align-self-center">Active filters:</span>
          {activeFilters.map(f => (
            <Badge
              key={f.key}
              bg="success"
              className="d-flex align-items-center gap-1"
              style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => removeFilter(f.key)}
            >
              {f.label} x
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterBar
