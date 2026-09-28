import { Card, Button, Badge } from "react-bootstrap";
import { GoStarFill } from "react-icons/go";
import { FaLocationDot, FaHeart, FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function ExploreCard({ place }) {
  const { user, favorites, toggleFavorite } = useUser();

  if (!place) return null;

  const isFav = favorites.some((f) => f.id === place.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(place);
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        marginBottom: "var(--space-4)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
        background: "var(--color-surface)",
        transition: "transform var(--transition-base), box-shadow var(--transition-base)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Image — left side */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Card.Img
          src={place.imageUrl || "https://placehold.co/200x200"}
          alt={place.name}
          style={{
            width: "240px",
            height: "100%",
            minHeight: "200px",
            objectFit: "cover",
            borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
          }}
        />

        {/* Category badge */}
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

        {/* Favorite button */}
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
            transition: "transform var(--transition-fast)",
          }}
        >
          {isFav ? (
            <FaHeart color="var(--color-danger)" />
          ) : (
            <FaRegHeart color="var(--color-text-secondary)" />
          )}
        </button>
      </div>

      {/* Details — right side */}
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "var(--space-4)",
        }}
      >
        <div>
          {/* Name — large and bold */}
          <h5
            style={{
              fontWeight: "var(--font-weight-bold)",
              fontSize: "var(--font-size-lg)",
              marginBottom: "var(--space-2)",
              color: "var(--color-text-primary)",
            }}
          >
            {place.name}
          </h5>

          {/* Relevance score */}
          {place.relevanceScore != null && place.relevanceScore > 0 && (
            <Badge
              bg={
                place.relevanceScore >= 90
                  ? "dark"
                  : place.relevanceScore >= 75
                  ? "success"
                  : place.relevanceScore >= 60
                  ? "warning"
                  : place.relevanceScore >= 45
                  ? "info"
                  : "secondary"
              }
              className="mb-2 me-2"
            >
              {place.relevanceScore}% match
            </Badge>
          )}

          {/* Description — 3 lines max */}
          <p
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--line-height-base)",
            }}
          >
            {place.description}
          </p>
        </div>

        {/* Footer — city, rate, price, button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <FaLocationDot style={{ color: "var(--color-primary)" }} />{" "}
              {place.city}
            </span>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <GoStarFill color="gold" /> {place.rate}
            </span>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-primary)",
              }}
            >
              {place.price === "free" || !place.price ? "Free" : `$${place.price}`}
            </span>
          </div>
          <Button
            as={Link}
            to={`/${place.type === 'recommend' ? 'place' : (place.type || 'place')}/${place.id}`}
            state={{ place }}
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "6px 16px",
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-medium)",
              cursor: "pointer",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "var(--color-primary-dark)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "var(--color-primary)")
            }
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ExploreCard;
