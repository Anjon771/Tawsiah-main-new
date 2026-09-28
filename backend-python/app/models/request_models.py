from pydantic import BaseModel
from typing import List, Dict, Optional

class RecommendationRequest(BaseModel):
    categories: Optional[List[str]] = []
    cities: Optional[List[str]] = []
    userId: Optional[int] = None
    weights: Optional[Dict[str, float]] = None
    limit: Optional[int] = 10

class ProfileUpdateRequest(BaseModel):
    userId: int
    interests: List[str] = []       # category interests
    cities: List[str] = []          # city interests
    recentViews: List[int] = []     # place IDs
    favorites: List[int] = []       # place IDs
    sessionCategories: List[str] = []

class RerankRequest(BaseModel):
    placeIds: List[int]
    categories: List[str]
    userId: Optional[int] = None
