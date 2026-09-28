import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { getAllInterests, saveUserInterests } from '../services/interestService';
import InterestSelector from './InterestSelector';

const FALLBACK_INTERESTS = [
  { id: 1, name: 'Beach', type: 'category' },
  { id: 2, name: 'Nature', type: 'category' },
  { id: 3, name: 'Mountains', type: 'category' },
  { id: 4, name: 'Historical', type: 'category' },
  { id: 5, name: 'Festivals', type: 'category' },
];

function EditInterestsModal({ show, onClose, currentInterests, userId, onSave }) {
  const [allInterests, setAllInterests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    const fetchInterests = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAllInterests();
        const data = Array.isArray(res.data) ? res.data : [];
        setAllInterests(data.length > 0 ? data : FALLBACK_INTERESTS);
      } catch (err) {
        console.error('Failed to load interests:', err);
        setError('Failed to load interests.');
        setAllInterests(FALLBACK_INTERESTS);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, [show]);

  useEffect(() => {
    if (show && currentInterests) {
      const ids = currentInterests.map((i) => i.id || i);
      setSelectedIds(ids);
    }
  }, [show, currentInterests]);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const numericIds = selectedIds.filter(
        (id) => typeof id === 'number' || !isNaN(Number(id))
      ).map((id) => Number(id));

      await saveUserInterests(userId, numericIds);

      const saved = allInterests
        .filter((i) => selectedIds.includes(i.id))
        .map((i) => ({ id: i.id, name: i.name, type: i.type || 'category' }));

      onSave(saved);
      onClose();
    } catch (err) {
      console.error('Failed to save interests:', err);
      setError('Failed to save interests. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
          Edit Your Interests
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <InterestSelector
            available={allInterests}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            mode="compact"
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleSave}
          disabled={saving || selectedIds.length === 0}
        >
          {saving ? 'Saving...' : 'Save Interests'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditInterestsModal;
