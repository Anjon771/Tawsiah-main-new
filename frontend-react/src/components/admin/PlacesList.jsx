import { useState } from "react";
import { Button } from "react-bootstrap";
import { BsTrash, BsChevronDown, BsChevronUp, BsCalendarEvent } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { usePlaces } from "../../contexts/PlacesContext";
import PlaceCardAdmin from "./PlaceCardAdmin";
import EmptyState from "../EmptyState";

function PlacesList({ onEdit }) {
  const { events, places, removeEvent } = usePlaces();
  const [expandedEvents, setExpandedEvents] = useState({});

  const toggleEvent = (eventId) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div>
      {/* Events */}
      <h5
        style={{
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-text-primary)",
          marginBottom: "var(--space-3)",
        }}
      >
        Events
      </h5>

      {events.length === 0 ? (
        <EmptyState
          icon={<BsCalendarEvent size={48} color="var(--color-text-muted)" />}
          title="No events yet"
          subtitle="Add an event to get started."
        />
      ) : (
        events.map((event) => {
          const isExpanded = expandedEvents[event.id] !== false;
          return (
            <div
              key={event.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                marginBottom: "var(--space-3)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Event Header */}
              <div
                onClick={() => toggleEvent(event.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-primary-subtle)",
                  cursor: "pointer",
                  gap: "var(--space-3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  {event.eventImage && (
                    <img
                      src={event.eventImage}
                      alt={event.eventName}
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                      }}
                    />
                  )}
                  <div>
                    <strong
                      style={{
                        color: "var(--color-primary)",
                        fontSize: "var(--font-size-base)",
                      }}
                    >
                      {event.eventName || event.name}
                    </strong>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {event.eventDescription || event.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexShrink: 0 }}>
                  {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete event "${event.eventName || event.name}"?`)) {
                        removeEvent(event.id);
                      }
                    }}
                  >
                    <BsTrash />
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ padding: "var(--space-4)" }}>
                  <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                    <strong>City:</strong> {event.city || "N/A"} <br />
                    <strong>Category:</strong> {event.category || "N/A"} <br />
                    <strong>Price:</strong> {event.price || "N/A"} <br />
                    <strong>Rate:</strong> {event.rate || 0}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}

      <hr
        style={{
          borderColor: "var(--color-border-subtle)",
          margin: "var(--space-6) 0",
        }}
      />

      {/* Places */}
      <h5
        style={{
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-text-primary)",
          marginBottom: "var(--space-3)",
        }}
      >
        Places
      </h5>

      {places.length === 0 ? (
        <EmptyState
          icon={<FaLocationDot size={48} color="var(--color-text-muted)" />}
          title="No places yet"
          subtitle="Add a place to get started."
        />
      ) : (
        places.map((place) => (
          <PlaceCardAdmin key={place.id} place={place} onEdit={onEdit} />
        ))
      )}
    </div>
  );
}

export default PlacesList;
