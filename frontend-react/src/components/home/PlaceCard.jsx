import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { GoStarFill } from "react-icons/go";
import { FaLocationDot, FaHeart, FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

function PlaceCard({ place }) {
  const { user, favorites, toggleFavorite } = useUser();
  const [hovered, setHovered] = useState(false);

  if (!place) return "Loading...";

  const isFav = favorites.some((f) => f.id === place.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(place);
  };

  return (
    <Card
      className="place-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0",
        borderRadius: "var(--radius-lg)",
        border: hovered
          ? "2px solid var(--color-primary)"
          : "1px solid var(--color-border)",
        boxShadow: hovered
          ? "var(--shadow-lg)"
          : "var(--shadow-sm)",
        background: hovered ? "var(--color-primary-subtle)" : "var(--color-surface)",
        overflow: "hidden",
        cursor: "pointer",
        height: "100%",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Image Container */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <Card.Img
          className="place-card-img"
          src={place.imageUrl || "https://placehold.co/400x300"}
          alt={place.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />

        {/* Category Badge */}
        {place.category && (
          <span
            style={{
              position: "absolute",
              bottom: "var(--space-2)",
              left: "var(--space-2)",
              background: "var(--color-primary)",
              color: "#fff",
              padding: "2px 10px",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-weight-semibold)",
              textTransform: "capitalize",
            }}
          >
            {place.category}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          style={{
            position: "absolute",
            top: "var(--space-2)",
            right: "var(--space-2)",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "var(--radius-full)",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "transform 0.15s ease",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          {isFav ? (
            <FaHeart color="var(--color-danger)" />
          ) : (
            <FaRegHeart color="var(--color-text-secondary)" />
          )}
        </button>
      </div>

      {/* Card Body */}
      <Card.Body className="p-3 place-card-body">
        <Card.Title
          className="my-0 mb-2 place-card-title"
          style={{
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-semibold)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: hovered ? "var(--color-primary)" : "var(--color-text-primary)",
            transition: "color 0.25s ease",
          }}
        >
          {place.name}
        </Card.Title>

        <Card.Text
          className="text-muted small mb-2"
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          <FaLocationDot style={{ color: "var(--color-primary)" }} /> {place.city}
          <span style={{ margin: "0 6px" }}>•</span>
          <GoStarFill color="gold" /> {place.rate?.toFixed(1) || "—"}
        </Card.Text>

        <Card.Text
          className="text-muted small mb-3 place-card-description"
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "var(--line-height-base)",
          }}
        >
          {place.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <span
            style={{
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-primary)",
            }}
          >
            {place.price === "free" || !place.price ? "Free" : `$${place.price}`}
          </span>

          <Button
            as={Link}
            to={`/${place.type === 'recommend' ? 'place' : (place.type || 'place')}/${place.id}`}
            state={{ place }}
            variant={hovered ? "success" : "outline-success"}
            size="sm"
            style={{
              borderRadius: "var(--radius-sm)",
              padding: "6px 16px",
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PlaceCard;
