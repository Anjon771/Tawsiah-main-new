import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { getMapPoints } from "../services/mapService";
import { EmptyStateMap } from "../components/ui/EmptyStates";
import { toast } from "react-toastify";

function createCustomIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: #0ea36a;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function formatPrice(price) {
  if (!price) return "Free";
  const p = String(price).trim().toLowerCase();
  if (p === "free" || p === "0" || p === "0.0") return "Free";
  return `$${price}`;
}

// إصلاح مشكلة أيقونة Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Map() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMapPoints();

        if (res.status === 204) {
          setPlaces([]);
          return;
        }

        const data = res.data;
        const normalized = Array.isArray(data) ? data : [data];

        const validPlaces = normalized.filter(
          (place) =>
            place?.location &&
            typeof place.location.latitude === "number" &&
            typeof place.location.longitude === "number"
        );

        setPlaces(validPlaces);
      } catch (err) {
        setError("Failed to load map places");
        toast.error("Failed to load map data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const defaultCenter = useMemo(() => {
    if (places.length > 0) {
      return [places[0].location.latitude, places[0].location.longitude];
    }

    return [23.8859, 45.0792];
  }, [places]);

  const handleViewDetails = (place) => {
    const path = place.isEvent ? `/event/${place.id}` : `/place/${place.id}`;
    navigate(path);
  };

  return (
    <main className="map-page">
      <div className="map-card">
        <div className="map-header">
          <h2>Interactive Map</h2>
          <p>Explore attractions across Saudi Arabia</p>
        </div>

        {error && (
          <div className="map-error" style={{ textAlign: "center", padding: "20px" }}>
            <EmptyStateMap onAction={() => window.location.reload()} />
          </div>
        )}

        {loading ? (
          <div
            style={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-3)",
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid var(--color-border)",
                borderTopColor: "var(--color-primary)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>Loading map data...</p>
          </div>
        ) : (
          <div className="map-wrapper">
            <MapContainer
              center={defaultCenter}
              zoom={6}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.location.latitude, place.location.longitude]}
                  icon={createCustomIcon()}
                >
                  <Popup minWidth={247} maxWidth={287}>
                    <div className="map-popup-card">
                      <div className="map-popup-img-wrap">
                        <img
                          src={place.imageUrl || "https://placehold.co/300x140?text=No+Image"}
                          alt={place.name}
                          className="map-popup-img"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/300x140?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="map-popup-body">
                        <h5 className="map-popup-title">{place.name}</h5>
                        <div className="map-popup-details">
                          <span className="map-popup-city">
                            {place.city || "Unknown location"}
                          </span>
                          <span className="map-popup-price">
                            {formatPrice(place.price)}
                          </span>
                        </div>
                        <button
                          className="map-popup-btn"
                          onClick={() => handleViewDetails(place)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div style={{ padding: "40px 20px" }}>
            <EmptyStateMap onAction={() => navigate("/explore")} />
          </div>
        )}

        <div className="map-legend">
          <span className="legend-dot"></span>
          <span>Places & Events</span>
        </div>
      </div>
    </main>
  );
}

export default Map;
