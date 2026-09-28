from pydantic import BaseModel
from typing import List, Optional

class ScoredItem(BaseModel):
    id: int
    score: float
    confidence: float
    reason: str
    category: Optional[str] = None
    city: Optional[str] = None
    type: str = "event"  # "place" or "event"

class RecommendationResponse(BaseModel):
    itemIds: List[int]
    eventIds: List[int] = []  # backward-compatible alias for Java
    scoredItems: List[ScoredItem]
    totalCandidates: int
    strategy: str

class RerankResponse(BaseModel):
    rankedIds: List[int]
