from app.core.database import client, ITEMS_COLLECTION
from app.core.embeddings import get_user_embedding
from typing import List, Dict

# i will be making many notes cuz ts is too complex

# function that gets personalized recommendations based on user preference
def get_recommendations(user_preferences: List[str], limit: int = 10, filters: Dict = None) -> List[Dict]:
    
     # Generate user vector from preferences
    user_vector = get_user_embedding(user_preferences)

    # this is an optional feat, remove if canceled apon finalization
    query_filter = None
    if filters:
        from qdrant_client.models import Filter, FieldCondition, MatchValue
        conditions = []
        
        for key, value in filters.items():
            conditions.append(
                FieldCondition(key=key, match=MatchValue(value=value))
            )
        
        if conditions:
            query_filter = Filter(must=conditions)

    # Use query_points instead of search
    response = client.query_points(
        collection_name=ITEMS_COLLECTION,
        query=user_vector,
        query_filter=query_filter,
        limit=limit,
        with_payload=True,
        with_vectors=False
    )
    
    # query_points returns an object; we need the .points list
    results = response.points

    # Formating results
    recommendations = []
    for result in results:
        item = {
            "id": result.id,
            "score": round(result.score, 3),  
            **result.payload  
        }
        recommendations.append(item)
    
    return recommendations