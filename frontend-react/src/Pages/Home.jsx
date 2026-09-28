import { useEffect } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Carousell from "../components/home/Carousell.jsx";
import {
  LuTreePalm,
  LuPartyPopper,
  LuWaves,
  LuMountain,
} from "react-icons/lu";
import { BsBank } from "react-icons/bs";
import {
  FaLandmark,
  FaPersonHiking,
  FaBagShopping,
  FaMusic,
  FaMasksTheater,
  FaMosque,
  FaLocationDot,
} from "react-icons/fa6";
import PlaceCard from "../components/home/PlaceCard.jsx";
import CategorieCard from "../components/home/CategorieCard.jsx";
import RecommendedSection from "../components/RecommendedSection.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { BsExclamationTriangle } from "react-icons/bs";
import { usePlaces } from "../contexts/PlacesContext";
import { useFeaturedPlaces } from "../contexts/FeaturedPlacesContext";

function Home() {
  const language = localStorage.getItem("language") || "en";
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, [language]);

  const { places, loading, error } = usePlaces();
  const { featuredPlaces } = useFeaturedPlaces();

  const visiblePlaces = places?.slice(0, 9);

  return (
    <>
      {/* ── Hero ── */}
      <Container fluid className="px-0">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            background: "var(--color-primary-dark)",
            color: "var(--color-text-inverse)",
            padding: "var(--space-6) var(--space-5)",
            gap: "var(--space-5)",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <h1
              style={{
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
                marginBottom: "var(--space-3)",
              }}
            >
              Welcome
            </h1>
            <p
              style={{
                fontSize: "var(--font-size-md)",
                lineHeight: "var(--line-height-relaxed)",
                margin: 0,
              }}
            >
              Discover the beauty and heritage of Saudi Arabia
            </p>
          </div>
          <div style={{ flex: "2 1 400px" }}>
            {featuredPlaces.length > 0 ? (
              <Carousell />
            ) : (
              <Alert
                variant="light"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "none",
                }}
              >
                No featured places yet
              </Alert>
            )}
          </div>
        </div>
      </Container>

      {/* ── Categories ── */}
      <Container fluid className="py-5 px-3 px-md-5">
        <h3
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          Categories
        </h3>
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            overflowX: "auto",
            paddingBottom: "var(--space-2)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <CategorieCard icon={LuTreePalm} name="Nature" />
          <CategorieCard icon={LuMountain} name="Mountains" />
          <CategorieCard icon={BsBank} name="Historical" />
          <CategorieCard icon={LuWaves} name="Beaches" />
          <CategorieCard icon={LuPartyPopper} name="Festivals" />
          <CategorieCard icon={FaLandmark} name="Museum" />
          <CategorieCard icon={FaPersonHiking} name="Adventure" />
          <CategorieCard icon={FaBagShopping} name="Shopping" />
          <CategorieCard icon={FaMusic} name="Entertainment" />
          <CategorieCard icon={FaMasksTheater} name="Cultural" />
          <CategorieCard icon={FaMosque} name="Religious" />
        </div>
      </Container>

      {/* ── Browse by City ── */}
      <Container fluid className="py-5 px-3 px-md-5" style={{ background: 'var(--color-background)' }}>
        <h3
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Browse by City
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <CategorieCard icon={FaLocationDot} name="Riyadh" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Jeddah" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Mecca" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Medina" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Dammam" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Khobar" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Abha" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Taif" filter="city" />
          <CategorieCard icon={FaLocationDot} name="Tabuk" filter="city" />
          <CategorieCard icon={FaLocationDot} name="AlUla" filter="city" />
        </div>
      </Container>

      {/* ── Recommended ── */}
      <div className="py-5" style={{ background: "var(--color-background)" }}>
        <RecommendedSection />
      </div>

      {/* ── Explore Places ── */}
      <Container fluid className="py-5 px-3 px-md-5">
        <h3
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          Explore Places
        </h3>

        {loading && (
          <div className="places-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {error && (
          <EmptyState
            icon={<BsExclamationTriangle size={48} color="var(--color-text-muted)" />}
            title="Something went wrong"
            subtitle={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && (
          <>
            <div className="places-grid">
              {visiblePlaces?.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
            <div className="text-center mt-5">
              <Button
                className="btn-primary-custom"
                onClick={() => navigate('/explore')}
              >
                Show More
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
