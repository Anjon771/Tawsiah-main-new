import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Image, Row, Col, Button } from "react-bootstrap";
import PlaceRate from "./PlaceRate";
import { useUser } from "../contexts/UserContext";
import { getRatingsByEvent } from "../services/ratingService";
import { getEventById } from "../services/eventService";
import { getPlaceById } from "../services/placeService";
import EmptyState from "./EmptyState";
import SkeletonCard from "./SkeletonCard";
import { toast } from "react-toastify";

import { FaLocationDot } from "react-icons/fa6";
import { WiDirectionUpRight } from "react-icons/wi";
import { BsPersonCircle, BsExclamationTriangle, BsPencilSquare, BsStarFill, BsStar } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import CommentBox from "./CommentBox";
import TicketReserve from "./booking/TicketReserve";

function normalizeEvent(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    imageUrl: dto.imageUrl,
    city: dto.city,
    rate: dto.rate,
    price: dto.price,
    category: dto.category,
    schedule: dto.schedule || { date: "", startAt: "", endAt: "" },
    latitude: dto.location?.latitude || 0,
    longitude: dto.location?.longitude || 0,
  };
}

function normalizePlace(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    imageUrl: dto.imageURL || dto.imageUrl,
    city: dto.city,
    rate: dto.rate,
    price: dto.price,
    category: dto.category,
    schedule: dto.schedule || { date: "", startAt: "", endAt: "" },
    latitude: dto.location?.latitude || 0,
    longitude: dto.location?.longitude || 0,
  };
}

function PlacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { user, toggleFavorite, favorites, trackView } = useUser();

  const isRecommendRoute = pathname.startsWith('/place/recomanation/');
  const isEventRoute = pathname.startsWith('/event/');
  const isPlaceRoute = pathname.startsWith('/place/') && !isRecommendRoute;

  const [place, setPlace] = useState(null);
  const [entityLoading, setEntityLoading] = useState(true);
  const [entityError, setEntityError] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState("");

  /* ── Resolve entity: state → API ── */
  useEffect(() => {
    const resolveEntity = async () => {
      // 1. Use navigation state if the card passed the full object
      if (state?.place) {
        setPlace(state.place);
        setEntityLoading(false);
        return;
      }

      // 2. Determine which API to call based on route type
      try {
        setEntityLoading(true);
        setEntityError("");

        if (isRecommendRoute || isEventRoute) {
          const res = await getEventById(Number(id));
          setPlace(normalizeEvent(res.data));
        } else if (isPlaceRoute) {
          const res = await getPlaceById(Number(id));
          setPlace(normalizePlace(res.data));
        } else {
          setEntityError("Unknown route type.");
        }
      } catch (err) {
        console.error("Failed to load entity:", err);
        setEntityError("Failed to load place details. Please try again.");
      } finally {
        setEntityLoading(false);
      }
    };

    resolveEntity();
  }, [id, pathname, state, isRecommendRoute, isEventRoute, isPlaceRoute]);

  /* ── Ratings ── */
  useEffect(() => {
    const fetchRatings = async () => {
      if (!id) return;
      try {
        setRatingsLoading(true);
        setRatingsError("");
        const res = await getRatingsByEvent(Number(id));
        setRatings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load ratings:", err);
        setRatingsError("Failed to load ratings.");
      } finally {
        setRatingsLoading(false);
      }
    };
    fetchRatings();
  }, [id]);

  /* ─-- Track view ── */
  useEffect(() => {
    if (place) trackView(place);
  }, [place]);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.info("Please log in to save places to your favorites.");
      navigate("/login");
      return;
    }
    toggleFavorite(place);
  };

  const isFavorite = favorites.some((f) => f.id === place?.id);

  const handleCommentAdded = (newComment) => {
    setRatings((prev) => [...prev, newComment]);
  };

  if (entityLoading) {
    return (
      <Container className="py-5">
        <SkeletonCard />
      </Container>
    );
  }

  if (entityError) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<BsExclamationTriangle size={48} color="var(--color-text-muted)" />}
          title="Something went wrong"
          subtitle={entityError}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      </Container>
    );
  }

  if (!place) {
    return (
      <Container className="py-5">
        <EmptyState
          icon={<FaLocationDot size={48} color="var(--color-text-muted)" />}
          title="Place not found"
          subtitle="We couldn't find the place you're looking for."
          actionLabel="Go Home"
          onAction={() => navigate('/home')}
        />
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col>
            <Image
              className="w-100"
              src={place.imageUrl || "https://placehold.co/800x400"}
              style={{ height: "400px", objectFit: "cover", borderRadius: "var(--radius-lg)" }}
              fluid
            />
          </Col>
        </Row>

        <Row className="mt-4 mx-0">
          <Col lg={10}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)" }}>
              {place.name}
            </h2>
            <p style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
              {place.description}
            </p>
            <p>
              <PlaceRate rate={place.rate} />
            </p>
            <Button
              onClick={handleToggleFavorite}
              style={{
                background: isFavorite ? "var(--color-danger)" : "transparent",
                color: isFavorite ? "#fff" : "var(--color-text-secondary)",
                border: isFavorite ? "none" : "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 18px",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
                transition: "all var(--transition-fast)",
              }}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />} Save to favorite
            </Button>
          </Col>

          <Col lg={2} className="place-info mt-4 mt-lg-0">
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
              }}
            >
              <p className="align-items-center d-flex mb-2 gap-2" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                <HiOutlineCalendarDateRange size={24} style={{ color: "var(--color-primary)" }} />
                {place.schedule?.date ? place.schedule.date : "yyyy-mm-dd"}
              </p>

              <div className="d-flex align-items-center mb-2 gap-2" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                <IoTimeOutline size={24} style={{ color: "var(--color-primary)" }} />
                {place.schedule?.startAt ? place.schedule.startAt : "startAt"} - {place.schedule?.endAt ? place.schedule.endAt : "endAt"}
              </div>
              <hr style={{ borderColor: "var(--color-border-subtle)" }} />

              <div className="d-flex flex-row justify-content-between mb-3">
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  Price starts from:
                </p>
                <strong style={{ fontSize: "var(--font-size-base)", color: "var(--color-primary)" }}>
                  ${place.price || 0}
                </strong>
              </div>

              <Button
                onClick={() => setModalShow(true)}
                className="w-100 btn-primary-custom"
              >
                Select a ticket
              </Button>
            </div>

            <TicketReserve
              price={place.price || 0}
              place={place}
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </Col>
        </Row>
        <hr style={{ borderColor: "var(--color-border-subtle)", margin: "var(--space-6) 0" }} />
      </Container>

      <Container className="pb-5">
        <h3 style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-4)" }}>
          Location
        </h3>

        <div
          style={{
            height: "400px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface-raised)",
            color: "var(--color-text-muted)",
          }}
          className="preview-box justify-content-center align-items-center d-flex rounded gap-2"
        >
          <FaLocationDot style={{ color: "var(--color-primary)" }} />
          Tap to preview
        </div>
        <Button
          onClick={() => toast.info("Coming soon!")}
          className="mt-3 d-flex align-items-center btn-primary-custom"
        >
          <WiDirectionUpRight size={24} /> Get Directions
        </Button>

        <hr style={{ borderColor: "var(--color-border-subtle)", margin: "var(--space-6) 0" }} />
      </Container>

      <Container className="pb-5">
        <h3 style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-4)" }}>
          Reviews & Ratings
        </h3>

        {ratingsLoading && <p className="text-muted" style={{ fontSize: "var(--font-size-sm)" }}>Loading reviews...</p>}
        {ratingsError && <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{ratingsError}</p>}

        {ratings.length > 0 ? (
          <div className="comments-list mb-4">
            {ratings.map((r, index) => (
              <div
                key={r.id || index}
                className="p-3 mb-3"
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <BsPersonCircle size={28} style={{ color: "var(--color-text-muted)" }} />
                  <strong style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)" }}>
                    {r.userName || 'Anonymous'}
                  </strong>
                  <span style={{ display: 'inline-flex', gap: '2px', color: '#FFC107', fontSize: "var(--font-size-sm)" }}>
                    {Array.from({ length: r.rating || 0 }).map((_, i) => (
                      <BsStarFill key={`f-${i}`} />
                    ))}
                    {Array.from({ length: 5 - (r.rating || 0) }).map((_, i) => (
                      <BsStar key={`e-${i}`} />
                    ))}
                  </span>
                </div>
                {r.comment && <p className="mb-0" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          !ratingsLoading && (
            <EmptyState
              icon={<BsPencilSquare size={48} color="var(--color-text-muted)" />}
              title="No reviews yet"
              subtitle="Be the first to leave a review!"
            />
          )
        )}

        <h4 style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-primary)", marginTop: "var(--space-5)", marginBottom: "var(--space-3)" }}>
          Write a Review
        </h4>
        <Row className="mt-3 mx-0">
          <CommentBox onCommentAdded={handleCommentAdded} />
        </Row>
      </Container>
    </>
  );
}

export default PlacePage;
