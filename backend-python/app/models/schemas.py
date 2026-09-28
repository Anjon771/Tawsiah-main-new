from pydantic import BaseModel
from typing import List, Optional

# --------------------------------------- (recieveing data from springboot)
class PlaceData(BaseModel):
    id: int
    name: str
    description: str
    category: str
    location: str
    rating: Optional[float] = 0.0

class EventData(BaseModel):
    id: int
    name: str
    description: str
    category: str
    location: str

class UnifiedRecommendationRequest(BaseModel):
    preferences: List[str]
    city: str
    places: List[PlaceData]
    events: List[EventData]
    limit: Optional[int] = 10


#--------------------------------------------- (sending back the response to springboot)
class RecommendationResponseItem(BaseModel):
    id: int
    score: float
    type: str # "place" or "event"  (i almost forgot about this lol)

class RecommendationResponse(BaseModel):
    userId: int
    status: str
    count: int
    recommendations: List[RecommendationResponseItem]