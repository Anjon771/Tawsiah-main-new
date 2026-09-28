import httpx
from typing import List, Dict, Optional
from .preference_store import preference_store

SPRING_BOOT_URL = "http://localhost:8082"


async def fetch_all_items() -> tuple:
    """Fetch both places and events from Spring Boot."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            places_res = await client.get(f"{SPRING_BOOT_URL}/place")
            places_res.raise_for_status()
            places = places_res.json()
        except Exception as e:
            print(f"Failed to fetch places: {e}")
            places = []

        try:
            events_res = await client.get(f"{SPRING_BOOT_URL}/event")
            events_res.raise_for_status()
            events = events_res.json()
        except Exception as e:
            print(f"Failed to fetch events: {e}")
            events = []

    return places, events


def normalize_city(city: str) -> str:
    return city.lower().strip().replace("-", "").replace("'", "")


def score_items(
    places: List[dict],
    events: List[dict],
    categories: List[str],
    cities: List[str],
    user_id: Optional[int] = None,
    limit: int = 10
) -> List[dict]:
    """
    Hybrid scoring engine for both places and events.
    Works with:
      - Categories only
      - Cities only
      - Both categories and cities
      - Empty preferences (falls back to top-rated)
    """

    # Get personalized weights from user profile
    user_weights = preference_store.get_weights(user_id) if user_id else {}
    user_city_weights = preference_store.get_city_weights(user_id) if user_id else {}

    # Build priority maps
    category_priority = {
        cat.lower(): len(categories) - idx
        for idx, cat in enumerate(categories)
    }

    city_priority = {
        normalize_city(city): len(cities) - idx
        for idx, city in enumerate(cities)
    }

    scored = []

    # ---- Score places ----
    for place in places:
        item_cat  = (place.get("category") or "").lower().strip()
        item_city = normalize_city(place.get("city") or "")
        item_rate = place.get("rate") or place.get("rating") or 0

        score, reasons = _score_single(
            item_cat, item_city, item_rate,
            category_priority, city_priority,
            user_weights, user_city_weights
        )

        scored.append({
            "id": place.get("id"),
            "score": round(score, 4),
            "confidence": round(min(score / max(len(categories) * 2 + len(cities) * 1.8 + 10, 1), 1.0), 4),
            "reason": " & ".join(reasons) if reasons else "Top rated in Saudi Arabia",
            "category": item_cat,
            "city": item_city,
            "type": "place"
        })

    # ---- Score events ----
    for event in events:
        item_cat  = (event.get("category") or "").lower().strip()
        item_city = normalize_city(event.get("city") or "")
        item_rate = event.get("rate") or event.get("rating") or 0

        score, reasons = _score_single(
            item_cat, item_city, item_rate,
            category_priority, city_priority,
            user_weights, user_city_weights
        )

        scored.append({
            "id": event.get("id"),
            "score": round(score, 4),
            "confidence": round(min(score / max(len(categories) * 2 + len(cities) * 1.8 + 10, 1), 1.0), 4),
            "reason": " & ".join(reasons) if reasons else "Top rated in Saudi Arabia",
            "category": item_cat,
            "city": item_city,
            "type": "event"
        })

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Always return at least `limit` results
    top = [s for s in scored if s["score"] > 0.5]
    if len(top) < limit:
        top_ids = {s["id"] for s in top}
        fallback = [s for s in scored if s["id"] not in top_ids]
        top = top + fallback[:limit - len(top)]

    return top[:limit]


def _score_single(
    item_cat: str,
    item_city: str,
    item_rate: float,
    category_priority: dict,
    city_priority: dict,
    user_weights: dict,
    user_city_weights: dict
) -> tuple:
    score = 0.0
    reasons = []

    # Category score
    cat_base = category_priority.get(item_cat, 0)
    if cat_base > 0:
        score += cat_base * 2.0
        reasons.append(f"matches category: {item_cat}")

    # Personalization boost (category)
    personal_boost = user_weights.get(item_cat, 0) * 10
    if personal_boost > 0:
        score += personal_boost
        reasons.append("matches your profile")

    # City score
    city_base = city_priority.get(item_city, 0)
    if city_base == 0:
        for pref_city in city_priority:
            if pref_city in item_city or item_city in pref_city:
                city_base = city_priority[pref_city]
                break

    if city_base > 0:
        score += city_base * 1.8
        reasons.append(f"in {item_city}")

    # Personalization boost (city)
    city_personal = user_city_weights.get(item_city, 0) * 8
    if city_personal > 0:
        score += city_personal
        reasons.append("matches your city preference")

    # Quality signal
    quality = item_rate * 0.5
    score += quality

    return score, reasons
