from fastapi import APIRouter
from ..models.request_models import ProfileUpdateRequest
from ..engine.preference_store import preference_store

router = APIRouter()

@router.post("/update-profile")
async def update_profile(request: ProfileUpdateRequest):
    profile = {
        "interests": request.interests,
        "cities": request.cities,
        "favoriteCategories": [],
        "recentCategories": [],
        "sessionCategories": request.sessionCategories
    }
    preference_store.update_profile(request.userId, profile)
    return {"status": "updated", "userId": request.userId}
