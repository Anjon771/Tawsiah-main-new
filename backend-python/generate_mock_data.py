import random
import json

# Templates for generating diverse places
LOCATIONS = ["null"]

CATEGORIES = {
    "historical": {
        "names": ["Fort", "Palace", "Heritage Village", "Old Town", "Archaeological Site", "Castle", "Ancient Ruins", "Historic Gate", "Traditional Souq", "Heritage Museum"],
        "descriptions": [
            "ancient {adj} architecture with traditional Saudi design",
            "historic site showcasing {adj} heritage and culture",
            "{adj} landmark from the early Saudi period",
            "preserved {adj} structure with authentic artifacts",
            "UNESCO heritage site with {adj} significance"
        ],
        "adjectives": ["traditional", "authentic", "preserved", "restored", "iconic", "legendary", "ancient", "cultural", "historic", "monumental"]
    },
    "nature": {
        "names": ["National Park", "Valley", "Mountain", "Beach", "Desert", "Oasis", "Canyon", "Crater", "Islands", "Nature Reserve"],
        "descriptions": [
            "{adj} natural landscape with stunning views",
            "beautiful {adj} scenery perfect for outdoor activities",
            "{adj} destination with hiking trails and wildlife",
            "pristine {adj} environment with unique geology",
            "scenic {adj} area ideal for nature lovers"
        ],
        "adjectives": ["breathtaking", "pristine", "spectacular", "beautiful", "stunning", "magnificent", "peaceful", "scenic", "untouched", "dramatic"]
    },
    "entertainment": {
        "names": ["Theme Park", "Entertainment City", "Gaming Center", "Bowling Alley", "Cinema Complex", "Arcade", "Fun Zone", "Adventure Park", "Water Park", "Trampoline Park"],
        "descriptions": [
            "{adj} entertainment venue with activities for all ages",
            "popular {adj} destination for families and friends",
            "{adj} facility with modern amenities and attractions",
            "exciting {adj} center with various entertainment options",
            "{adj} complex featuring games, rides, and shows"
        ],
        "adjectives": ["modern", "exciting", "family-friendly", "popular", "thrilling", "fun-filled", "vibrant", "lively", "dynamic", "engaging"]
    },
    "shopping": {
        "names": ["Mall", "Shopping Center", "Souq", "Bazaar", "Market", "Plaza", "Galleria", "Retail Park", "Shopping District", "Commercial Center"],
        "descriptions": [
            "{adj} shopping destination with international brands",
            "premier {adj} mall featuring luxury stores and dining",
            "{adj} market offering local and imported goods",
            "expansive {adj} center with diverse retail options",
            "{adj} shopping experience with entertainment facilities"
        ],
        "adjectives": ["luxury", "modern", "upscale", "traditional", "premium", "extensive", "contemporary", "flagship", "exclusive", "renowned"]
    },
    "cultural": {
        "names": ["Museum", "Art Gallery", "Cultural Center", "Library", "Exhibition Hall", "Heritage Center", "Cultural Village", "Arts Complex", "Performance Theater", "Convention Center"],
        "descriptions": [
            "{adj} cultural institution showcasing Saudi heritage",
            "renowned {adj} center promoting arts and culture",
            "{adj} museum featuring exhibitions and artifacts",
            "modern {adj} venue for cultural events and programs",
            "{adj} facility celebrating local traditions and arts"
        ],
        "adjectives": ["prestigious", "renowned", "celebrated", "acclaimed", "distinguished", "prominent", "esteemed", "notable", "impressive", "world-class"]
    },
    "dining": {
        "names": ["Restaurant", "Cafe", "Bistro", "Grill", "Eatery", "Dining House", "Food Court", "Seafood Restaurant", "Rooftop Restaurant", "Traditional Kitchen"],
        "descriptions": [
            "{adj} dining experience with authentic flavors",
            "popular {adj} restaurant serving delicious cuisine",
            "{adj} eatery known for quality food and ambiance",
            "renowned {adj} establishment with diverse menu",
            "{adj} venue offering fine dining and local specialties"
        ],
        "adjectives": ["authentic", "gourmet", "exquisite", "renowned", "celebrated", "popular", "traditional", "contemporary", "upscale", "cozy"]
    }
}

def generate_place_name(category, location):
    """Generate a realistic place name"""
    name_template = random.choice(CATEGORIES[category]["names"])
    
    # Sometimes add location prefix
    if random.random() > 0.5:
        return f"{location} {name_template}"
    else:
        # Add Arabic-inspired prefix occasionally
        prefixes = ["Al-", "Al ", "King Abdulaziz ", "Prince ", ""]
        prefix = random.choice(prefixes)
        return f"{prefix}{name_template}"

def generate_description(category):
    """Generate a description for a place"""
    template = random.choice(CATEGORIES[category]["descriptions"])
    adjective = random.choice(CATEGORIES[category]["adjectives"])
    return template.format(adj=adjective).capitalize()

def generate_rating():
    """Generate realistic ratings between 3.5 and 5.0"""
    return round(random.uniform(3.5, 5.0), 1)

def generate_mock_places(total_count=100):
    """Generate diverse mock places"""
    places = []
    
    # Distribute evenly across categories
    categories = list(CATEGORIES.keys())
    places_per_category = total_count // len(categories)
    
    for category in categories:
        for _ in range(places_per_category):
            location = random.choice(LOCATIONS)
            place = {
                "type": "place",
                "name": generate_place_name(category, location),
                "description": generate_description(category),
                "category": category,
                "location": location,
                "rating": generate_rating()
            }
            places.append(place)
    
    return places

def generate_mock_events(count=20):
    """Generate mock events"""
    event_types = [
        ("Festival", "cultural festival celebrating Saudi heritage and traditions"),
        ("Concert", "live music performance featuring local and international artists"),
        ("Exhibition", "showcase of art, culture, and innovation"),
        ("Sports Event", "competitive sporting event with regional teams"),
        ("Food Festival", "culinary celebration featuring diverse cuisines"),
        ("Cultural Show", "traditional performance highlighting local culture"),
        ("Tech Conference", "gathering of technology professionals and innovators"),
        ("Book Fair", "literary event featuring authors and publishers"),
        ("Film Festival", "screening of regional and international films"),
        ("Marathon", "running event for fitness enthusiasts and athletes")
    ]
    
    categories_for_events = ["entertainment", "cultural", "dining", "entertainment", "cultural"]
    months = ["03", "04", "05", "06", "09", "10", "11", "12"]
    
    events = []
    for i in range(count):
        event_type, desc_template = random.choice(event_types)
        location = random.choice(LOCATIONS)
        category = random.choice(categories_for_events)
        month = random.choice(months)
        day = f"{random.randint(1, 28):02d}"
        
        event = {
            "type": "event",
            "name": f"{location} {event_type} 2026",
            "description": desc_template.capitalize(),
            "category": category,
            "location": location,
            "start_date": f"2026-{month}-{day}"
        }
        events.append(event)
    
    return events

# Generate data
print("Generating mock data...")
places = generate_mock_places(100)  # Generate 100 places
events = generate_mock_events(20)   # Generate 20 events

# Save to file
output = {
    "places": places,
    "events": events
}

with open("mock_data.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"✅ Generated {len(places)} places and {len(events)} events")
print("📁 Saved to mock_data.json")

# Also print Python format for easy copy-paste
print("\n" + "="*50)
print("Copy this into your data_processor.py:")
print("="*50)
print(f"\nMOCK_PLACES = {json.dumps(places[:10], indent=4, ensure_ascii=False)}")
print(f"\n# ... {len(places)-10} more places")
print(f"\nMOCK_EVENTS = {json.dumps(events[:5], indent=4, ensure_ascii=False)}")
print(f"\n# ... {len(events)-5} more events")