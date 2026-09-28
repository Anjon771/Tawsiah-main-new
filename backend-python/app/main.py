from fastapi import FastAPI, Path as FastAPIPath, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.core.database import initialize_collections
import json
from pathlib import Path

from .routers import recommendation, profile, health

app = FastAPI(title="Tawsiah Recommendation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8082", "http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include new modular routers
app.include_router(recommendation.router)
app.include_router(profile.router)
app.include_router(health.router)

JSONL_PATH = Path(__file__).parent / "dataset_filtering" / "output.jsonl"

# Conditionally import heavy ML modules — if sentence-transformers is missing,
# the recommendation endpoint returns 503 and mock-data init is skipped.
try:
    from app.services.data_processor import initialize_data
    from app.models.schemas import UnifiedRecommendationRequest, RecommendationResponse
    from app.core.embeddings import get_place_embedding
    from app.core.database import client, ITEMS_COLLECTION
    from app.services.recommendation_service import get_recommendations
    _ml_ready = True
except Exception as e:
    print(f"[WARNING] ML modules not available: {e}")
    _ml_ready = False
    initialize_data = None
    UnifiedRecommendationRequest = None
    RecommendationResponse = None
    get_place_embedding = None
    client = None
    ITEMS_COLLECTION = None
    get_recommendations = None

@app.on_event("startup")
async def startup_event():
    print("Starting Tawsiah AI Engine...")
    initialize_collections()

    if _ml_ready:
        # -------------------------------------------------------------------------
        # Loading MOCK data - keep this for now, but comment it out once
        # Spring Boot sync is the primary data source to avoid data duplication
        initialize_data()
        # -------------------------------------------------------------------------
    else:
        print("[INFO] Skipping mock data init — ML modules not available.")

    print("Engine Roars to Life.")

@app.get("/health")
def health_check():
    return {"status": "ok", "ml_ready": _ml_ready}

@app.get("/")
def read_root():
    return {"message": "Tawsiah AI Engine is running", "status": "ok", "ml_ready": _ml_ready}

@app.get("/places")
def get_places():
    """Read output.jsonl and return all places as a JSON array (for verification)."""
    if not JSONL_PATH.exists():
        raise HTTPException(status_code=404, detail="output.jsonl not found")

    places = []
    with open(JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    places.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return places

@app.post("/api/recommendation/{userId}")
async def handle_unified_request(
    request_data: dict,
    userId: str = FastAPIPath(..., description="The ID of the user from Spring Boot")
):
    """
    Legacy vector-based endpoint. Now forwards to the unified heuristic scorer
    for consistency and reliability. Returns only event IDs to maintain the
    Spring Boot contract (List<Long>).
    """
    try:
        from .engine.scorer import fetch_all_items, score_items
        from .engine.preference_store import preference_store

        places, events = await fetch_all_items()

        # Spring Boot sends {userId, categories, city} in the body
        categories = request_data.get("categories", [])
        if not categories and "preferences" in request_data:
            categories = request_data.get("preferences", [])

        city = request_data.get("city", "")
        cities = [city] if city else []

        # Fallback to stored profile if nothing provided
        uid = int(userId) if userId else None
        if not categories and not cities and uid:
            categories = list(preference_store.get_weights(uid).keys())
            cities = list(preference_store.get_city_weights(uid).keys())

        scored = score_items(
            places=places,
            events=events,
            categories=categories,
            cities=cities,
            user_id=uid,
            limit=request_data.get("limit", 10)
        )

        # Return only event IDs to preserve the Spring Boot contract
        event_ids = [s["id"] for s in scored if s["type"] == "event"]

        # If no events matched, return top-rated events as fallback
        if not event_ids and events:
            events_sorted = sorted(events, key=lambda e: e.get("rate", 0) or 0, reverse=True)
            event_ids = [e.get("id") for e in events_sorted[:10]]

        return event_ids

    except Exception as e:
        print(f"Error during recommendation: {e}")
        # Return empty list instead of 500 to prevent Spring Boot crash
        return []


SPRING_BOOT_URL = "http://localhost:8082"
