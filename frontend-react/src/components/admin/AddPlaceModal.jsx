import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
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

function AddPlaceModal({ show, onClose }) {
  const { addPlace, events } = usePlaces();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setSelectedEventId(null);
    setImagePreview(null);
    setImageBase64(null);
    onClose();
  };

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
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      eventId: selectedEventId,
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: formData.get("price") || "0",
      city: formData.get("city"),
      latitude: parseFloat(formData.get("latitude")) || 0,
      longitude: parseFloat(formData.get("longitude")) || 0,
      schedule: {
        date: formData.get("schedule_date") || null,
        startAt: formData.get("schedule_startAt") || null,
        endAt: formData.get("schedule_endAt") || null,
      },
      rate: 0.0,
      imageUrl: imageBase64 || "",
    };

    if (!data.name || !data.city || !data.description || !data.category) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setSaving(true);
    try {
      await addPlace(data);
      toast.success("Place added successfully!");
      e.target.reset();
      setSelectedEventId(null);
      setImagePreview(null);
      setImageBase64(null);
      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized — please log in as admin");
      } else if (err.response?.status === 400) {
        toast.error("Invalid data — please check all fields");
      } else {
        toast.error("Something went wrong — please try again");
      }
      console.error("Error adding place:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" contentClassName="modal-content-custom">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)" }}>
          Add Place
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addPlaceForm" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="eventId">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Add to Event (Optional)
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedEventId || ""}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="form-control-custom"
              style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}
            >
              <option value="">-- No event (standalone place) --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.eventName || event.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <h5 className="mb-3" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Basic Information
          </h5>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Name *
            </Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter place name" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Description *
            </Form.Label>
            <Form.Control as="textarea" name="description" rows={3} placeholder="Enter description" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Category *
            </Form.Label>
            <Form.Control as="select" name="category" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}>
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
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              City/Location *
            </Form.Label>
            <Form.Select name="city" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}>
              <option value="">-- Select a city --</option>
              {SAUDI_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Price
            </Form.Label>
            <Form.Control type="text" name="price" placeholder='e.g., "free" or "100"' className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Location
          </h5>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="latitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Latitude</Form.Label>
                <Form.Control type="number" name="latitude" placeholder="0.0" step="0.000001" defaultValue="0.0" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="longitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Longitude</Form.Label>
                <Form.Control type="number" name="longitude" placeholder="0.0" step="0.000001" defaultValue="0.0" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Schedule (Optional)
          </h5>

          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="schedule_date">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Date</Form.Label>
                <Form.Control type="date" name="schedule_date" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="schedule_startAt">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Start Time</Form.Label>
                <Form.Control type="time" name="schedule_startAt" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="schedule_endAt">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>End Time</Form.Label>
                <Form.Control type="time" name="schedule_endAt" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Place Image
          </h5>

          <Form.Group className="mb-3" controlId="imageUpload">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Upload Image
            </Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
            <Form.Text style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
              Max 2MB. Leave empty to use placeholder.
            </Form.Text>
          </Form.Group>

          {imagePreview && (
            <div className="mb-3">
              <img src={imagePreview} alt="Preview" className="rounded" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => { setImagePreview(null); setImageBase64(null); }}>
                Remove Image
              </Button>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={handleClose} style={{ borderRadius: "var(--radius-sm)" }}>
          Cancel
        </Button>
        <LoadingButton loading={saving} loadingText="Adding..." className="btn-primary-custom" form="addPlaceForm" type="submit">
          Add Place
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
}

export default AddPlaceModal;
