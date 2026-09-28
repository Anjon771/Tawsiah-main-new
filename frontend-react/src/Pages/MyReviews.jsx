import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { useUser } from "../contexts/UserContext";
import { getProfile } from "../services/profileService";
import { EmptyStateReviews } from "../components/ui/EmptyStates";
import { toast } from "react-toastify";
import "./MyReviews.css";

function MyReviews() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProfile(user?.id);
        const data = res.data;
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          reviews: data.reviews || [],
        });
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews");
        toast.error("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReviews();
    } else {
      setLoading(false);
      setError("Please log in to view reviews.");
    }
  }, [user]);

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <span style={{ display: 'inline-flex', gap: '2px', color: '#FFC107' }}>
        {Array.from({ length: full }).map((_, i) => (
          <BsStarFill key={`f-${i}`} />
        ))}
        {half > 0 && <BsStarHalf key="h" />}
        {Array.from({ length: empty }).map((_, i) => (
          <BsStar key={`e-${i}`} />
        ))}
      </span>
    );
  };

  return (
    <main className="reviews-layout">
      <aside className="reviews-sidebar reviews-card">
        <div className="reviews-user-box">
          <div className="reviews-avatar">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="reviews-user-name">
            {profileData.name || "User Name"}
          </div>
          <div className="reviews-user-email">
            {profileData.email || "user@email.com"}
          </div>
        </div>

        <div className="reviews-menu">
          <button
            className="reviews-menu-item"
            onClick={() => navigate("/profile")}
          >
            <span>Overview</span>
          </button>

          <button className="reviews-menu-item active">
            <span>My Reviews</span>
            <span className="reviews-arrow">›</span>
          </button>

          <button
            className="reviews-menu-item"
            onClick={() => navigate("/settings")}
          >
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <section className="reviews-content reviews-card">
        <div className="reviews-header">
          <h2>My Reviews</h2>

          <p>
            {loading
              ? "Loading reviews..."
              : `You have written ${profileData.reviews?.length || 0} reviews`}
          </p>

          {error && <p className="reviews-error">{error}</p>}
        </div>

        <div className="reviews-list">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="review-item"
                  style={{ opacity: 0.6 }}
                >
                  <div className="review-image-wrap skeleton" style={{ width: "95px", height: "95px", borderRadius: "var(--radius-md)" }} />
                  <div className="review-body" style={{ flex: 1, gap: "var(--space-2)", display: "flex", flexDirection: "column" }}>
                    <div className="skeleton" style={{ height: "20px", width: "40%", borderRadius: "var(--radius-sm)" }} />
                    <div className="skeleton" style={{ height: "16px", width: "60%", borderRadius: "var(--radius-sm)" }} />
                    <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "var(--radius-sm)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && profileData.reviews?.length === 0 ? (
            <div style={{ padding: "var(--space-6)" }}>
              <EmptyStateReviews onAction={() => navigate("/explore")} />
            </div>
          ) : (
            profileData.reviews?.map((review, index) => (
              <div className="review-item" key={review.id || index}>
                <div className="review-image-wrap">
                  <img
                    src={review.imageUrl || "https://placehold.co/95x95?text=Place"}
                    alt={review.eventName || "Place"}
                    className="review-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/95x95?text=Place";
                    }}
                  />
                </div>

                <div className="review-body">
                  <div className="review-top">
                    <div>
                      <h3>{review.eventName || "Unknown Place"}</h3>

                      <div className="review-stars">
                        {renderStars(review.rating || 0)}
                      </div>
                    </div>

                    <div className="review-date">
                      {review.date || ""}
                    </div>
                  </div>

                  <p className="review-comment">
                    {review.comment || "No comment provided."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default MyReviews;
