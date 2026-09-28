import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { usePlaces } from "../../contexts/PlacesContext";

function AddPlaceTab({ onSuccess }) {
  const { addPlace, events } = usePlaces();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [message, setMessage] = useState("");

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
      imageUrl: "",
    };

    if (!data.name || !data.city || !data.description || !data.category) {
      setMessage("Please fill in all required fields!");
      return;
    }

    try {
      await addPlace(data);
      e.target.reset();
      setSelectedEventId(null);
      setMessage("Place added successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Unauthorized — please log in as admin");
      } else if (err.response?.status === 400) {
        setMessage("Invalid data — please check all fields");
      } else {
        setMessage("Something went wrong — please try again");
      }
      console.error("Error adding place:", err.response?.data || err);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}
          style={{ borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}
        >
          {message}
        </div>
      )}

      <Form id="addPlaceForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="eventId">
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Add to Event (Optional)
          </Form.Label>
          <Form.Control
            as="select"
            value={selectedEventId || ""}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          >
            <option value="">-- No event (standalone place) --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName || event.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <h5
          className="mb-3"
          style={{
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-primary)",
          }}
        >
          Basic Information
        </h5>

        <Form.Group className="mb-3" controlId="name">
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Name *
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter place name"
            required
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Description *
          </Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            placeholder="Enter description"
            required
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Category *
          </Form.Label>
          <Form.Control
            as="select"
            name="category"
            required
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          >
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
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            City/Location *
          </Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city (e.g., AlBaha, Riyadh)"
            required
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label
            style={{
              fontWeight: "var(--font-weight-medium)",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            Price
          </Form.Label>
          <Form.Control
            type="text"
            name="price"
            placeholder='e.g., "free" or "100"'
            className="form-control-custom"
            style={{
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-size-base)",
            }}
          />
        </Form.Group>

        <h5
          className="mb-3 mt-4"
          style={{
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-primary)",
          }}
        >
          Location
        </h5>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="latitude">
              <Form.Label
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Latitude
              </Form.Label>
              <Form.Control
                type="number"
                name="latitude"
                placeholder="0.0"
                step="0.000001"
                defaultValue="0.0"
                className="form-control-custom"
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="longitude">
              <Form.Label
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Longitude
              </Form.Label>
              <Form.Control
                type="number"
                name="longitude"
                placeholder="0.0"
                step="0.000001"
                defaultValue="0.0"
                className="form-control-custom"
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5
          className="mb-3 mt-4"
          style={{
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-text-primary)",
          }}
        >
          Schedule (Optional)
        </h5>

        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="schedule_date">
              <Form.Label
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="schedule_date"
                className="form-control-custom"
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="schedule_startAt">
              <Form.Label
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Start Time
              </Form.Label>
              <Form.Control
                type="time"
                name="schedule_startAt"
                className="form-control-custom"
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="schedule_endAt">
              <Form.Label
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                End Time
              </Form.Label>
              <Form.Control
                type="time"
                name="schedule_endAt"
                className="form-control-custom"
                style={{
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4">
          <Button
            className="btn-primary-custom"
            form="addPlaceForm"
            type="submit"
            style={{
              borderRadius: "var(--radius-sm)",
              padding: "10px 24px",
              fontSize: "var(--font-size-base)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            Add Place
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddPlaceTab;
