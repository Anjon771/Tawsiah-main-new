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

function AddEventModal({ show, onClose }) {
  const { addEvent } = usePlaces();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      eventName: formData.get("eventName"),
      eventDescription: formData.get("eventDescription"),
      city: formData.get("city") || "",
      latitude: parseFloat(formData.get("latitude")) || 0,
      longitude: parseFloat(formData.get("longitude")) || 0,
    };

    if (!data.eventName || !data.eventDescription || !data.city) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setSaving(true);
    try {
      await addEvent(data);
      toast.success("Event added successfully!");
      e.target.reset();
      onClose();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Invalid data — please check all fields");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized — please log in as admin");
      } else {
        toast.error("Something went wrong — please try again");
      }
      console.error("Error adding event:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" contentClassName="modal-content-custom">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)" }}>
          Add Event
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEventForm" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="eventName">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Event Name *
            </Form.Label>
            <Form.Control type="text" name="eventName" placeholder="Enter event name" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventDescription">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Description *
            </Form.Label>
            <Form.Control as="textarea" name="eventDescription" rows={3} placeholder="Enter event description" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              City / Location *
            </Form.Label>
            <Form.Select name="city" required className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }}>
              <option value="">-- Select a city --</option>
              {SAUDI_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <h5 className="mb-3 mt-4" style={{ fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)" }}>
            Location (Optional)
          </h5>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="latitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Latitude</Form.Label>
                <Form.Control type="number" name="latitude" step="0.000001" defaultValue="0" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="longitude">
                <Form.Label style={{ fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>Longitude</Form.Label>
                <Form.Control type="number" name="longitude" step="0.000001" defaultValue="0" className="form-control-custom" style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-base)" }} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={onClose} style={{ borderRadius: "var(--radius-sm)" }}>
          Cancel
        </Button>
        <LoadingButton loading={saving} loadingText="Adding..." className="btn-primary-custom" form="addEventForm" type="submit">
          Add Event
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEventModal;
