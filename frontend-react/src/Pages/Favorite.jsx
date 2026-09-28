import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Container, Card } from "react-bootstrap";
import { BsLock, BsHeartFill } from "react-icons/bs";
import EmptyState from "../components/EmptyState";

function Favorite() {
  const navigate = useNavigate();
  const { user, favorites } = useUser();

  if (!user) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<BsLock size={48} color="var(--color-text-muted)" />}
          title="Please log in"
          subtitle="You need to be logged in to save and view favorite places."
          actionLabel="Go to Login"
          onAction={() => navigate("/login")}
        />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        My Favorite Places
      </h3>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<BsHeartFill size={48} color="var(--color-danger)" />}
          title="No favorites yet"
          subtitle="Browse places and click the heart icon to add them here."
          actionLabel="Explore Places"
          onAction={() => navigate('/explore')}
        />
      ) : (
        <div className="places-grid">
          {favorites.map((place) => (
            <Card
              key={place.id}
              style={{
                cursor: "pointer",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                background: "var(--color-surface)",
                transition: "transform var(--transition-base), box-shadow var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
              onClick={() =>
                navigate(
                  `/${place.type === 'recommend' ? 'place' : (place.type || 'place')}/${place.id}`,
                  { state: { place } }
                )
              }
            >
              <Card.Img
                variant="top"
                src={place.imageUrl}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body style={{ padding: "var(--space-4)" }}>
                <Card.Title
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {place.name}
                </Card.Title>
                <Card.Text style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                  {place.description?.substring(0, 80)}...
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default Favorite;
