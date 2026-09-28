from app.services.recommendation_service import get_recommendations

# Test 1: Get recommendations based on user preference
prefs = ["historical", "museums", "cultural"]
print("=" * 50)
print(f"Test 1: User who likes {prefs}")
print("=" * 50)
results = get_recommendations(prefs, limit=20)
for item in results:
    print(f"Score: {item['score']} | {item['name']} ({item['category']})")