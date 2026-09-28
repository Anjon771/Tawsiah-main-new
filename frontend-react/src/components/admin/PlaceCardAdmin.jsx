import { Button } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { usePlaces } from "../../contexts/PlacesContext";

function PlaceCardAdmin({ place, onEdit }) {
  const { deletePlace } = usePlaces();

  const title = place.title || place.name || "Place not found";
  const description = place.description || "";
  const location = place.location || place.city || "City";
  const category = place.category || "N/A";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-4)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
        marginBottom: "var(--space-3)",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow var(--transition-base)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
    >
      <img
        src={place.imageUrl || "https://placehold.co/120x120"}
        alt={title}
        style={{
          width: "100px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
        }}
      />

      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <h6
          style={{
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-1)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h6>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-1)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <span
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-muted)",
            textTransform: "capitalize",
          }}
        >
          {location} • {category}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          flexShrink: 0,
        }}
      >
        <Button
          size="sm"
          onClick={() => onEdit(place)}
          style={{
            background: "var(--color-primary)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          <AiOutlineEdit className="me-1" /> Edit
        </Button>
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => {
            if (window.confirm(`Delete "${title}"?`)) {
              deletePlace(place.id);
            }
          }}
          style={{
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          <AiOutlineDelete className="me-1" /> Delete
        </Button>
      </div>
    </div>
  );
}

export default PlaceCardAdmin;
