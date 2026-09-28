from app.core.database import client, ITEMS_COLLECTION #possible bugs caused by name mismatches
from app.core.embeddings import get_place_embedding
from qdrant_client.models import PointStruct
import uuid
import hashlib

#  this data processor is very complex so i will be using many notes and comments to explain the code inshallah
#  The input data is being mocked for now, so remove it later whenever we complete the integration with springboot


###########################################################################
#                               MOCK DATA                                      (need to sync IDs with postgre db *very important*)
###########################################################################

MOCK_PLACES = [
    {
      "type": "place",
      "name": "Jazan Castle",
      "description": "Historic site showcasing legendary heritage and culture",
      "category": "historical",
      "location": "Jazan",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Al-Fort",
      "description": "Unesco heritage site with historic significance",
      "category": "historical",
      "location": "Khobar",
      "rating": 4.6
    },
    {
      "type": "place",
      "name": "Khobar Traditional Souq",
      "description": "Unesco heritage site with legendary significance",
      "category": "historical",
      "location": "Khobar",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Prince Old Town",
      "description": "Ancient monumental architecture with traditional saudi design",
      "category": "historical",
      "location": "Dammam",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Jeddah Fort",
      "description": "Ancient ancient architecture with traditional saudi design",
      "category": "historical",
      "location": "Jeddah",
      "rating": 4.5
    },
    {
      "type": "place",
      "name": "Medina Historic Gate",
      "description": "Unesco heritage site with monumental significance",
      "category": "historical",
      "location": "Medina",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Riyadh Archaeological Site",
      "description": "Cultural landmark from the early saudi period",
      "category": "historical",
      "location": "Riyadh",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Khobar Fort",
      "description": "Iconic landmark from the early saudi period",
      "category": "historical",
      "location": "Khobar",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Al Archaeological Site",
      "description": "Ancient ancient architecture with traditional saudi design",
      "category": "historical",
      "location": "Tabuk",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "Al-Castle",
      "description": "Historic site showcasing restored heritage and culture",
      "category": "historical",
      "location": "Jeddah",
      "rating": 4.5
    },
    {
      "type": "place",
      "name": "King Abdulaziz Fort",
      "description": "Historic site showcasing iconic heritage and culture",
      "category": "historical",
      "location": "Khobar",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "King Abdulaziz Traditional Souq",
      "description": "Unesco heritage site with traditional significance",
      "category": "historical",
      "location": "Jazan",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Old Town",
      "description": "Ancient landmark from the early saudi period",
      "category": "historical",
      "location": "Mecca",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Tabuk Archaeological Site",
      "description": "Ancient authentic architecture with traditional saudi design",
      "category": "historical",
      "location": "Tabuk",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Taif Archaeological Site",
      "description": "Historic site showcasing restored heritage and culture",
      "category": "historical",
      "location": "Taif",
      "rating": 4.5
    },
    {
      "type": "place",
      "name": "King Abdulaziz Castle",
      "description": "Unesco heritage site with ancient significance",
      "category": "historical",
      "location": "Taif",
      "rating": 4.5
    },
    {
      "type": "place",
      "name": "Khobar Beach",
      "description": "Pristine peaceful environment with unique geology",
      "category": "nature",
      "location": "Khobar",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Al-Valley",
      "description": "Dramatic destination with hiking trails and wildlife",
      "category": "nature",
      "location": "Dammam",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Khobar Islands",
      "description": "Beautiful scenic scenery perfect for outdoor activities",
      "category": "nature",
      "location": "Khobar",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Najran Oasis",
      "description": "Breathtaking natural landscape with stunning views",
      "category": "nature",
      "location": "Najran",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Khobar Desert",
      "description": "Dramatic destination with hiking trails and wildlife",
      "category": "nature",
      "location": "Khobar",
      "rating": 3.9
    },
    {
      "type": "place",
      "name": "Al-Ula Islands",
      "description": "Pristine spectacular environment with unique geology",
      "category": "nature",
      "location": "Al-Ula",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Al-Desert",
      "description": "Spectacular natural landscape with stunning views",
      "category": "nature",
      "location": "Khobar",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Dammam Desert",
      "description": "Scenic natural landscape with stunning views",
      "category": "nature",
      "location": "null",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Najran Nature Reserve",
      "description": "Magnificent natural landscape with stunning views",
      "category": "nature",
      "location": "null",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Najran Mountain",
      "description": "Beautiful magnificent scenery perfect for outdoor activities",
      "category": "nature",
      "location": "Najran",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Prince National Park",
      "description": "Beautiful breathtaking scenery perfect for outdoor activities",
      "category": "nature",
      "location": "Jeddah",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Khobar National Park",
      "description": "Stunning natural landscape with stunning views",
      "category": "nature",
      "location": "Khobar",
      "rating": 3.5
    },
    {
      "type": "place",
      "name": "Najran Canyon",
      "description": "Beautiful untouched scenery perfect for outdoor activities",
      "category": "nature",
      "location": "Najran",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Prince Valley",
      "description": "Pristine destination with hiking trails and wildlife",
      "category": "nature",
      "location": "Dammam",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Tabuk Islands",
      "description": "Magnificent natural landscape with stunning views",
      "category": "nature",
      "location": "Tabuk",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Mecca National Park",
      "description": "Beautiful beautiful scenery perfect for outdoor activities",
      "category": "nature",
      "location": "Mecca",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Jazan Cinema Complex",
      "description": "Fun-filled complex featuring games, rides, and shows",
      "category": "entertainment",
      "location": "Jazan",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "King Abdulaziz Trampoline Park",
      "description": "Exciting fun-filled center with various entertainment options",
      "category": "entertainment",
      "location": "Riyadh",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Mecca Entertainment City",
      "description": "Family-friendly facility with modern amenities and attractions",
      "category": "entertainment",
      "location": "Mecca",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Al Cinema Complex",
      "description": "Dynamic complex featuring games, rides, and shows",
      "category": "entertainment",
      "location": "Dammam",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Tabuk Arcade",
      "description": "Exciting thrilling center with various entertainment options",
      "category": "entertainment",
      "location": "Tabuk",
      "rating": 4.6
    },
    {
      "type": "place",
      "name": "Riyadh Bowling Alley",
      "description": "Popular family-friendly destination for families and friends",
      "category": "entertainment",
      "location": "Riyadh",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "King Abdulaziz Adventure Park",
      "description": "Popular dynamic destination for families and friends",
      "category": "entertainment",
      "location": "Jazan",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "King Abdulaziz Entertainment City",
      "description": "Modern entertainment venue with activities for all ages",
      "category": "entertainment",
      "location": "Khobar",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Jazan Adventure Park",
      "description": "Modern entertainment venue with activities for all ages",
      "category": "entertainment",
      "location": "Jazan",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Al Cinema Complex",
      "description": "Family-friendly facility with modern amenities and attractions",
      "category": "entertainment",
      "location": "Al-Ula",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Jeddah Entertainment City",
      "description": "Popular lively destination for families and friends",
      "category": "entertainment",
      "location": "Jeddah",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Prince Entertainment City",
      "description": "Lively complex featuring games, rides, and shows",
      "category": "entertainment",
      "location": "Dammam",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Al Trampoline Park",
      "description": "Exciting thrilling center with various entertainment options",
      "category": "entertainment",
      "location": "Dammam",
      "rating": 3.5
    },
    {
      "type": "place",
      "name": "Riyadh Entertainment City",
      "description": "Fun-filled entertainment venue with activities for all ages",
      "category": "entertainment",
      "location": "Riyadh",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Mecca Fun Zone",
      "description": "Popular exciting destination for families and friends",
      "category": "entertainment",
      "location": "Mecca",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "King Abdulaziz Gaming Center",
      "description": "Vibrant facility with modern amenities and attractions",
      "category": "entertainment",
      "location": "Mecca",
      "rating": 4.5
    },
    {
      "type": "place",
      "name": "Prince Shopping Center",
      "description": "Premier extensive mall featuring luxury stores and dining",
      "category": "shopping",
      "location": "Taif",
      "rating": 3.5
    },
    {
      "type": "place",
      "name": "Jazan Market",
      "description": "Premier contemporary mall featuring luxury stores and dining",
      "category": "shopping",
      "location": "Jazan",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Al-Ula Bazaar",
      "description": "Renowned market offering local and imported goods",
      "category": "shopping",
      "location": "Al-Ula",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Dammam Market",
      "description": "Extensive market offering local and imported goods",
      "category": "shopping",
      "location": "Dammam",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Al Shopping District",
      "description": "Flagship shopping experience with entertainment facilities",
      "category": "shopping",
      "location": "Khobar",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Prince Galleria",
      "description": "Contemporary market offering local and imported goods",
      "category": "shopping",
      "location": "Jeddah",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Bazaar",
      "description": "Traditional market offering local and imported goods",
      "category": "shopping",
      "location": "Abha",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Najran Market",
      "description": "Premier extensive mall featuring luxury stores and dining",
      "category": "shopping",
      "location": "Najran",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Commercial Center",
      "description": "Expansive upscale center with diverse retail options",
      "category": "shopping",
      "location": "Jeddah",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Najran Shopping Center",
      "description": "Premium shopping destination with international brands",
      "category": "shopping",
      "location": "Najran",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Prince Market",
      "description": "Renowned market offering local and imported goods",
      "category": "shopping",
      "location": "Khobar",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Mecca Souq",
      "description": "Modern shopping experience with entertainment facilities",
      "category": "shopping",
      "location": "Mecca",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Al Retail Park",
      "description": "Luxury shopping destination with international brands",
      "category": "shopping",
      "location": "Dammam",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Al-Commercial Center",
      "description": "Expansive contemporary center with diverse retail options",
      "category": "shopping",
      "location": "Jazan",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Abha Commercial Center",
      "description": "Expansive extensive center with diverse retail options",
      "category": "shopping",
      "location": "Abha",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "King Abdulaziz Shopping District",
      "description": "Luxury shopping experience with entertainment facilities",
      "category": "shopping",
      "location": "Tabuk",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Al-Cultural Village",
      "description": "Distinguished cultural institution showcasing saudi heritage",
      "category": "cultural",
      "location": "Taif",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Prince Cultural Village",
      "description": "Acclaimed museum featuring exhibitions and artifacts",
      "category": "cultural",
      "location": "Riyadh",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "King Abdulaziz Exhibition Hall",
      "description": "Modern world-class venue for cultural events and programs",
      "category": "cultural",
      "location": "Taif",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "King Abdulaziz Museum",
      "description": "Renowned facility celebrating local traditions and arts",
      "category": "cultural",
      "location": "Mecca",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Performance Theater",
      "description": "Celebrated museum featuring exhibitions and artifacts",
      "category": "cultural",
      "location": "Jeddah",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "King Abdulaziz Art Gallery",
      "description": "Modern world-class venue for cultural events and programs",
      "category": "cultural",
      "location": "Taif",
      "rating": 5.0
    },
    {
      "type": "place",
      "name": "Abha Performance Theater",
      "description": "Esteemed cultural institution showcasing saudi heritage",
      "category": "cultural",
      "location": "Abha",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "Khobar Exhibition Hall",
      "description": "Renowned esteemed center promoting arts and culture",
      "category": "cultural",
      "location": "Khobar",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Al Library",
      "description": "Celebrated cultural institution showcasing saudi heritage",
      "category": "cultural",
      "location": "Al-Ula",
      "rating": 4.4
    },
    {
      "type": "place",
      "name": "Najran Arts Complex",
      "description": "Acclaimed cultural institution showcasing saudi heritage",
      "category": "cultural",
      "location": "Najran",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Mecca Performance Theater",
      "description": "Renowned world-class center promoting arts and culture",
      "category": "cultural",
      "location": "Mecca",
      "rating": 3.5
    },
    {
      "type": "place",
      "name": "Riyadh Performance Theater",
      "description": "World-class museum featuring exhibitions and artifacts",
      "category": "cultural",
      "location": "Riyadh",
      "rating": 3.6
    },
    {
      "type": "place",
      "name": "Al-Exhibition Hall",
      "description": "Celebrated facility celebrating local traditions and arts",
      "category": "cultural",
      "location": "Tabuk",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Heritage Center",
      "description": "Modern esteemed venue for cultural events and programs",
      "category": "cultural",
      "location": "Riyadh",
      "rating": 4.2
    },
    {
      "type": "place",
      "name": "Mecca Convention Center",
      "description": "Renowned renowned center promoting arts and culture",
      "category": "cultural",
      "location": "Mecca",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Prince Convention Center",
      "description": "Esteemed facility celebrating local traditions and arts",
      "category": "cultural",
      "location": "Jazan",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Dining House",
      "description": "Renowned eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Tabuk",
      "rating": 3.9
    },
    {
      "type": "place",
      "name": "Al Bistro",
      "description": "Authentic venue offering fine dining and local specialties",
      "category": "dining",
      "location": "Mecca",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Prince Food Court",
      "description": "Renowned cozy establishment with diverse menu",
      "category": "dining",
      "location": "Riyadh",
      "rating": 4.3
    },
    {
      "type": "place",
      "name": "Medina Food Court",
      "description": "Authentic eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Medina",
      "rating": 4.6
    },
    {
      "type": "place",
      "name": "Tabuk Traditional Kitchen",
      "description": "Authentic venue offering fine dining and local specialties",
      "category": "dining",
      "location": "Tabuk",
      "rating": 3.7
    },
    {
      "type": "place",
      "name": "Restaurant",
      "description": "Celebrated eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Jeddah",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Abha Traditional Kitchen",
      "description": "Renowned exquisite establishment with diverse menu",
      "category": "dining",
      "location": "Abha",
      "rating": 3.8
    },
    {
      "type": "place",
      "name": "Al Bistro",
      "description": "Contemporary eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Tabuk",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Medina Cafe",
      "description": "Renowned venue offering fine dining and local specialties",
      "category": "dining",
      "location": "Medina",
      "rating": 4.8
    },
    {
      "type": "place",
      "name": "Prince Traditional Kitchen",
      "description": "Traditional dining experience with authentic flavors",
      "category": "dining",
      "location": "Mecca",
      "rating": 4.7
    },
    {
      "type": "place",
      "name": "Abha Restaurant",
      "description": "Authentic eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Abha",
      "rating": 4.1
    },
    {
      "type": "place",
      "name": "Tabuk Eatery",
      "description": "Traditional dining experience with authentic flavors",
      "category": "dining",
      "location": "Tabuk",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Abha Traditional Kitchen",
      "description": "Authentic eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Abha",
      "rating": 4.6
    },
    {
      "type": "place",
      "name": "Khobar Dining House",
      "description": "Celebrated eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Khobar",
      "rating": 4.0
    },
    {
      "type": "place",
      "name": "Al-Food Court",
      "description": "Contemporary eatery known for quality food and ambiance",
      "category": "dining",
      "location": "Dammam",
      "rating": 4.9
    },
    {
      "type": "place",
      "name": "Prince Restaurant",
      "description": "Renowned traditional establishment with diverse menu",
      "category": "dining",
      "location": "Tabuk",
      "rating": 3.7
    }
]

MOCK_EVENTS = [
    {
        "type": "event",  # Added type field
        "name": "Riyadh Season 2026",
        "description": "Entertainment festival with concerts, shows, and cultural events",
        "category": "entertainment",
        "location": "Riyadh",
        "start_date": "2026-10-01"
    },
    {
        "type": "event",
        "name": "Jeddah Food Festival",
        "description": "Culinary event featuring local and international cuisine",
        "category": "dining",
        "location": "Jeddah",
        "start_date": "2026-05-15"
    },
    {
        "type": "event",
        "name": "Red Sea International Film Festival",
        "description": "Film festival showcasing regional and international cinema",
        "category": "cultural",
        "location": "Jeddah",
        "start_date": "2026-12-01"
    }
]

#the following functiont converts items into vectores and stores in single item collection, dont forget to change mock data to real data
def load_items_to_qdrant():

    
    points = []

    # Combine places and events into one list to keep the code DRY (Don't Repeat Yourself)
    all_items = MOCK_PLACES + MOCK_EVENTS

    for item in all_items:
        vector = get_place_embedding(item)
        
        # 2. FIXED: Use a deterministic ID based on the name.
        # This ensures if you run the script twice, it OVERWRITES instead of DUPLICATES.
        # We use NAMESPACE_DNS as a standard base for the UUID calculation.
        stable_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, item["name"]))

        point = PointStruct(
            id=stable_id,
            vector=vector,
            payload=item
        )
        points.append(point)

    # 3. UPSERT: Send to Qdrant
    client.upsert(
        collection_name=ITEMS_COLLECTION,
        points=points
    )

    print(f"Loaded {len(MOCK_PLACES)} places + {len(MOCK_EVENTS)} events = {len(points)} total items")

# lastly this is the main function that loads all data, called on app startup
def initialize_data():
    
    load_items_to_qdrant()
    print("Data initialization complete!")


__all__ = ["initialize_data"]