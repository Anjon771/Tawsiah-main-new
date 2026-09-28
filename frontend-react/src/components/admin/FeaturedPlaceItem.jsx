import { Button, ListGroup } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

function FeaturedPlaceItem({ place, onRemove }) {
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      style={{
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-2)",
        border: "1px solid var(--color-border-subtle)",
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      <div>
        <strong style={{ color: "var(--color-text-primary)", fontSize: "var(--font-size-base)" }}>
          {place.name}
        </strong>
        <br />
        <small style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          {place.city}
        </small>
      </div>
      <Button
        size="sm"
        onClick={() => onRemove(place.id)}
        title="Remove"
        style={{
          background: "var(--color-danger)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        <BsTrash /> Remove
      </Button>
    </ListGroup.Item>
  );
}

export default FeaturedPlaceItem;
