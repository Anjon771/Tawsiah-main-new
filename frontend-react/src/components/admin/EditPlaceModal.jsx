import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { usePlaces } from "../../contexts/PlacesContext";
import LoadingButton from "../ui/LoadingButton";
import { toast } from "react-toastify";

const SAUDI_CITIES = [
  'Riyadh', 'Jeddah', 'Makkah', 'Medina', 'Dammam',
  'Khobar', 'Dhahran', 'Abha', 'Taif', 'Tabuk',
  'Al Ula', 'Hail', 'Jizan', 'Najran', 'Al Ahsa',
  'Yanbu', 'Umluj', 'Haql', 'Turaif', 'Duba',
  'Jubail', 'Qatif', 'Buraydah', 'Sakaka', 'Arar'
];

function EditPlaceModal({ show, place, onClose }) {
  const { editPlace } = usePlaces();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (place) {
      setImagePreview(place.imageUrl || null);
      setImageBase64(place.imageUrl || null);
      setImageChanged(false);
    }
  }, [place]);

  if (!place) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
      setImageChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      id: place.id,
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: formData.get("price"),
      city: formData.get("city"),
      latitude: parseFloat(formData.get("latitude")) || 0.0,
      longitude: parseFloat(formData.get("longitude")) || 0.0,
      schedule: {
        date: formData.get("schedule_date") || "",
        startAt: formData.get("schedule_startAt") || "",
        endAt: formData.get("schedule_endAt") || "",
      },
      rate: place.rate || 0.0,
      imageUrl: imageBase64 || place.imageUrl,
    };

    if (!data.name || !data.city || !data.description || !data.category) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setSaving(true);
    try {
      await editPlace(place.id, data);
      toast.success("Place updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Error updating place. Please try again.");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName="modal-content-custom">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)" }}>
          Edit Place
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="editPlaceForm" onSubmit={handleSubmit}>
          <h5 className="mb-3" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Basic Information
          </h5>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Name *</Form.Label>
            <Form.Control type="text" name="name" defaultValue={place.name} required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Description *</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} defaultValue={place.description} required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Category *</Form.Label>
            <Form.Control as="select" name="category" defaultValue={place.category || ""} required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}>
              <option value="">-- Select a category --</option>
              <option value="beaches">Beaches</option>
              <option value="nature">Nature</option>
              <option value="mountains">Mountains</option>
              <option value="historical">Historical</option>
              <option value="festivals">Festivals</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>City/Location *</Form.Label>
            <Form.Select name="city" defaultValue={place.city || ""} required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}>
              <option value="">-- Select a city --</option>
              {SAUDI_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Price</Form.Label>
            <Form.Control type="text" name="price" defaultValue={place.price || ""} placeholder='e.g., "free" or "100"' className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Location</h5>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="latitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Latitude</Form.Label>
                <Form.Control type="number" name="latitude" placeholder="0.0" step="0.000001" defaultValue={place.latitude || 0.0} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="longitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Longitude</Form.Label>
                <Form.Control type="number" name="longitude" placeholder="0.0" step="0.000001" defaultValue={place.longitude || 0.0} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Schedule (Optional)</h5>

          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="schedule_date">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Date</Form.Label>
                <Form.Control type="date" name="schedule_date" defaultValue={place.schedule?.date || ""} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="schedule_startAt">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Start Time</Form.Label>
                <Form.Control type="time" name="schedule_startAt" defaultValue={place.schedule?.startAt || ""} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="schedule_endAt">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>End Time</Form.Label>
                <Form.Control type="time" name="schedule_endAt" defaultValue={place.schedule?.endAt || ""} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>Image</h5>

          <Form.Group className="mb-3" controlId="imageUpload">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Upload New Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
            <Form.Text style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>Leave empty to keep current image</Form.Text>
          </Form.Group>

          {imagePreview && (
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{imageChanged ? "New Image Preview" : "Current Image"}</Form.Label>
              <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3)", maxWidth: "100%" }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
              </div>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={onClose} style={{ borderRadius: "var(--radius-sm)" }}>
          Cancel
        </Button>
        <LoadingButton loading={saving} loadingText="Saving..." className="btn-primary-custom" form="editPlaceForm" type="submit">
          Save Place
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
}

export default EditPlaceModal;
