# In-memory preference store per user
# In production: replace with Redis

from typing import Dict
from collections import defaultdict

class PreferenceStore:
    def __init__(self):
        self._profiles: Dict[int, dict] = {}
        self._category_weights: Dict[int, Dict[str, float]] = defaultdict(dict)
        self._city_weights: Dict[int, Dict[str, float]] = defaultdict(dict)

    def update_profile(self, user_id: int, profile: dict):
        self._profiles[user_id] = profile
        self._rebuild_weights(user_id, profile)

    def get_weights(self, user_id: int) -> Dict[str, float]:
        return self._category_weights.get(user_id, {})

    def get_city_weights(self, user_id: int) -> Dict[str, float]:
        return self._city_weights.get(user_id, {})

    def _rebuild_weights(self, user_id: int, profile: dict):
        # --- Category weights ---
        cat_weights = {}
        for interest in profile.get("interests", []):
            cat = interest.lower()
            cat_weights[cat] = cat_weights.get(cat, 0) + 1.0

        for cat in profile.get("favoriteCategories", []):
            cat = cat.lower()
            cat_weights[cat] = cat_weights.get(cat, 0) + 3.0

        for cat in profile.get("recentCategories", []):
            cat = cat.lower()
            cat_weights[cat] = cat_weights.get(cat, 0) + 1.5

        for cat in profile.get("sessionCategories", []):
            cat = cat.lower()
            cat_weights[cat] = cat_weights.get(cat, 0) + 2.0

        total = sum(cat_weights.values()) or 1
        self._category_weights[user_id] = {
            k: round(v / total, 4) for k, v in cat_weights.items()
        }

        # --- City weights ---
        city_weights = {}
        for city in profile.get("cities", []):
            c = city.lower().strip()
            city_weights[c] = city_weights.get(c, 0) + 1.0

        total_city = sum(city_weights.values()) or 1
        self._city_weights[user_id] = {
            k: round(v / total_city, 4) for k, v in city_weights.items()
        }

preference_store = PreferenceStore()
