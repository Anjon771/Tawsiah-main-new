from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
import os

# initialize the Qdrant client
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
client = QdrantClient(QDRANT_URL)

# collection names - with twin tower architicture
USERS_COLLECTION = "users"
ITEMS_COLLECTION = "items"

def initialize_collections():
    try:
        # The Users collection
        if not client.collection_exists(USERS_COLLECTION):
            client.create_collection(
                collection_name=USERS_COLLECTION,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )
            print(f"Created collection: {USERS_COLLECTION}")
        else:
            print(f"Collection already exists: {USERS_COLLECTION}")

        # The items collection stores places + events, say mashallah
        if not client.collection_exists(ITEMS_COLLECTION):
            client.create_collection(
                collection_name=ITEMS_COLLECTION,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )
            print(f"Created collection: {ITEMS_COLLECTION}")
        else:
            print(f"Collection already exists: {ITEMS_COLLECTION}")
    except Exception as e:
        print(f"[WARNING] Qdrant unavailable ({e}) — skipping collection init.")

# Exporting client and collection names
__all__ = ["client", "initialize_collections", "USERS_COLLECTION", "ITEMS_COLLECTION"]