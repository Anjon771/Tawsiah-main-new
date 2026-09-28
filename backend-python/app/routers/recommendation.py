from fastapi import APIRouter, HTTPException
from typing import List
import httpx

from ..models.request_models import RecommendationRequest, RerankRequest
from ..models.response_models import RecommendationResponse, ScoredItem, RerankResponse
from ..engine.scorer import fetch_all_items, score_items
from ..engine.preference_store import preference_store

router = APIRouter()

SPRING_BOOT_URL = "http://localhost:8082"

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(request: RecommendationRequest):
    try:
        places, events = await fetch_all_items()

        total_candidates = len(places) + len(events)

        # Always return something — even if empty
        if not places and not events:
            return RecommendationResponse(
                itemIds=[],
                scoredItems=[],
                totalCandidates=0,
                strategy="no_data"
            )

        # Handle empty preferences gracefully
        categories = request.categories or []
        cities = request.cities or []

        # If completely empty — use stored weights as fallback
        if not categories and not cities and request.userId:
            stored_weights = preference_store.get_weights(request.userId)
            categories = list(stored_weights.keys())
            stored_cities = preference_store.get_city_weights(request.userId)
            cities = list(stored_cities.keys())

        scored = score_items(
            places=places,
            events=events,
            categories=categories,
            cities=cities,
            user_id=request.userId,
            limit=request.limit or 10
        )

        # Determine strategy used
        if cities and categories:
            strategy = "hybrid_city_category"
        elif cities:
            strategy = "city_based"
        elif categories:
            strategy = "category_based"
        else:
            strategy = "top_rated_fallback"

        item_ids = [s["id"] for s in scored]
        event_ids = [s["id"] for s in scored if s["type"] == "event"]

        return RecommendationResponse(
            itemIds=item_ids,
            eventIds=event_ids,
            scoredItems=[ScoredItem(**s) for s in scored],
            totalCandidates=total_candidates,
            strategy=strategy
        )

    except Exception as e:
        print(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rerank", response_model=RerankResponse)
async def rerank(request: RerankRequest):
    """
    Re-rank already-filtered place IDs by user preference.
    Used after backend filter to personalize order.
    """
    try:
        user_weights = {}
        if request.userId:
            user_weights = preference_store.get_weights(request.userId)

        category_priority = {
            cat.lower(): len(request.categories) - idx
            for idx, cat in enumerate(request.categories)
        }

        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{SPRING_BOOT_URL}/place")
            response.raise_for_status()
            all_places = response.json()

        place_map = {p["id"]: p for p in all_places}
        target_places = [place_map[pid] for pid in request.placeIds if pid in place_map]

        scored = []
        for place in target_places:
            cat = (place.get("category") or "").lower()
            rate = place.get("rate") or 0

            base = category_priority.get(cat, 0)
            personal = user_weights.get(cat, 0) * 10
            quality = rate * 0.5

            scored.append({
                "id": place["id"],
                "score": base + personal + quality
            })

        scored.sort(key=lambda x: x["score"], reverse=True)

        return RerankResponse(rankedIds=[s["id"] for s in scored])

    except Exception as e:
        print(f"Rerank error: {e}")
        return RerankResponse(rankedIds=request.placeIds)
