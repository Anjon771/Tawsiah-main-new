import { Row, Col, Badge } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

const TYPE_LABELS = {
  city: 'Favorite Cities',
  category: 'Experience Types',
};

const TYPE_ORDER = ['city', 'category'];

export default function InterestSelector({ available, selectedIds, onToggle, mode = 'page' }) {
  const isSelected = (id) => selectedIds.includes(id);

  const grouped = available.reduce((acc, item) => {
    const type = item.type || 'category';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div>
      {TYPE_ORDER.map((type) => {
        const items = grouped[type];
        if (!items || items.length === 0) return null;

        return (
          <div key={type} className={mode === 'page' ? 'mb-5' : 'mb-4'}>
            <h5 className="fw-semibold mb-3 text-muted">
              {TYPE_LABELS[type] || type}
            </h5>
            <Row className="g-3">
              {items.map((item) => {
                const selected = isSelected(item.id);
                return (
                  <Col key={item.id} xs={6} sm={4} md={3} lg={2}>
                    <div
                      onClick={() => onToggle(item.id)}
                      className={`interest-chip text-center p-3 rounded-3 border ${
                        selected
                          ? 'border-success bg-success text-white'
                          : 'border-light bg-white text-dark'
                      }`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: selected
                          ? '0 4px 12px rgba(45,106,79,0.3)'
                          : '0 1px 3px rgba(0,0,0,0.08)',
                        transform: selected ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {item.icon || <BsStarFill size={28} />}
                      </div>
                      <div className="mt-1 fw-medium" style={{ fontSize: '13px' }}>
                        {item.name}
                      </div>
                      {selected && (
                        <Badge bg="light" text="success" className="mt-1">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
    </div>
  );
}
