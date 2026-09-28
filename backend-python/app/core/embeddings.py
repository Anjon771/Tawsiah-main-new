from  sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

# Converts places into a vector.
def get_place_embedding(place_data: dict) -> list[float]:
    
    # Combine place info into a single text
    text = f"{place_data.get('name', '')} {place_data.get('description', '')} {place_data.get('category', '')}"
    
    # Convert to vector
    embedding = model.encode(text)
    
    # Convert numpy array to list for JSON serialization
    return embedding.tolist()

# Converts user preferences into a vector.
def get_user_embedding(user_preferences: list[str]) -> list[float]:
    
    # Combine preferences into text
    text = " ".join(user_preferences)
    
    # Convert to vector
    embedding = model.encode(text)
    
    return embedding.tolist()


# Export functions
__all__ = ["get_place_embedding", "get_user_embedding"]