import { useState } from "react";
import { Form, Button, ListGroup, Alert, Row, Col } from "react-bootstrap";
import { BsPlus, BsStar } from "react-icons/bs";
import { usePlaces } from "../../contexts/PlacesContext";
import { useFeaturedPlaces } from "../../contexts/FeaturedPlacesContext";
import FeaturedPlaceItem from "./FeaturedPlaceItem";
import EmptyState from "../EmptyState";

function FeaturedPlacesManager() {
  const { places } = usePlaces();
  const { featuredPlaces, addFeatured, removeFeatured } = useFeaturedPlaces();
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [message, setMessage] = useState("");

  const handleAddFeatured = () => {
    if (!selectedPlaceId) {
      setMessage("Please select a place");
      return;
    }

    const selectedPlace = places.find((p) => p.id === parseInt(selectedPlaceId));
    if (!selectedPlace) {
      setMessage("Place not found");
      return;
    }

    if (featuredPlaces.find((p) => p.id === selectedPlace.id)) {
      setMessage("This place is already featured");
      return;
    }

    if (featuredPlaces.length >= 3) {
      setMessage("Maximum 3 featured places allowed. Remove one to add another.");
      return;
    }

    const success = addFeatured(selectedPlace);
    if (success) {
      setSelectedPlaceId("");
      setMessage("");
    }
  };

  const handleRemoveFeatured = (placeId) => {
    removeFeatured(placeId);
    setMessage("");
  };

  const availablePlaces = places.filter(
    (p) => !featuredPlaces.find((fp) => fp.id === p.id)
  );

  return (
    <div
      style={{
        marginTop: "var(--space-6)",
        padding: "var(--space-5)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h5
        style={{
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-primary)",
          marginBottom: "var(--space-4)",
        }}
      >
        Featured Places{" "}
        <small style={{ color: "var(--color-text-muted)", fontWeight: "var(--font-weight-regular)" }}>
          ({featuredPlaces.length}/3)
        </small>
      </h5>

      <Row className="mb-4 g-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label
              style={{
                fontWeight: "var(--font-weight-medium)",
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              Add to Featured
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedPlaceId}
              onChange={(e) => {
                setSelectedPlaceId(e.target.value);
                setMessage("");
              }}
              disabled={availablePlaces.length === 0}
              className="form-control-custom"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                fontSize: "var(--font-size-base)",
              }}
            >
              <option value="">-- Choose a place --</option>
              {availablePlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name} ({place.city})
                </option>
              ))}
            </Form.Control>
            {availablePlaces.length === 0 && featuredPlaces.length > 0 && (
              <Form.Text style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                All featured slots filled or no other places available
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button
            onClick={handleAddFeatured}
            disabled={!selectedPlaceId || availablePlaces.length === 0}
            className="w-100 fw-bold"
            style={{
              background: "var(--color-primary)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 24px",
              fontSize: "var(--font-size-base)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            <BsPlus /> Add to Featured
          </Button>
        </Col>
      </Row>

      {message && (
        <Alert
          variant={message.includes("allowed") ? "warning" : "info"}
          onClose={() => setMessage("")}
          dismissible
          className="mb-3"
          style={{ borderRadius: "var(--radius-md)", fontSize: "var(--font-size-sm)" }}
        >
          {message}
        </Alert>
      )}

      <div>
        <Form.Label
          style={{
            fontWeight: "var(--font-weight-medium)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
          }}
        >
          Featured Places List
        </Form.Label>
        {featuredPlaces.length > 0 ? (
          <ListGroup>
            {featuredPlaces.map((place) => (
              <FeaturedPlaceItem
                key={place.id}
                place={place}
                onRemove={handleRemoveFeatured}
              />
            ))}
          </ListGroup>
        ) : (
          <EmptyState icon={<BsStar size={48} color="var(--color-text-muted)" />} title="No featured places yet" subtitle="Select a place above to feature it on the homepage." />
        )}
      </div>

      {featuredPlaces.length > 0 && featuredPlaces.length < 3 && (
        <Form.Text style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-3)", display: "block" }}>
          You can add up to {3 - featuredPlaces.length} more featured place{3 - featuredPlaces.length !== 1 ? "s" : ""}
        </Form.Text>
      )}
    </div>
  );
}

export default FeaturedPlacesManager;
