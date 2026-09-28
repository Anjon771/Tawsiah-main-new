import json
import re

# Define keyword-to-category mappings (same as before)
KEYWORD_CATEGORY_MAP = {
    # Food & Beverage
    'cafe': 'cafe', 'coffee': 'cafe', 'coffe': 'cafe',
    'restaurant': 'restaurant', 'kitchen': 'restaurant', 'grill': 'restaurant',
    'pizza': 'fast_food', 'burger': 'fast_food', 'kfc': 'fast_food',
    'kudu': 'fast_food', 'herfy': 'fast_food', 'hardee': 'fast_food',
    'mcdonald': 'fast_food', 'domino': 'fast_food', 'papa john': 'fast_food',
    'subway': 'fast_food', 'shawarma': 'fast_food', 'broast': 'fast_food',
    'dunkin': 'fast_food', 'krispy': 'fast_food',
    'baskin': 'ice_cream', 'ice cream': 'ice_cream', 'juice': 'fast_food',
    
    # Healthcare
    'hospital': 'hospital', 'clinic': 'clinic', 'pharmacy': 'pharmacy',
    'medical': 'clinic', 'health': 'clinic', 'dentist': 'dentist',
    'veterinary': 'veterinary',
    
    # Financial
    'bank': 'bank', 'atm': 'atm', 'riyad bank': 'bank', 'sabb': 'bank',
    'ncb': 'bank', 'samba': 'bank', 'alrajhi': 'bank',
    'western union': 'money_transfer',
    
    # Fuel & Transport
    'fuel': 'fuel', 'gas station': 'fuel', 'petrol': 'fuel', 'naft': 'fuel',
    'sasco': 'fuel', 'aldrees': 'fuel', 'petromin': 'fuel',
    'bus': 'bus_station', 'saptco': 'bus_station',
    'car rental': 'car_rental', 'taxi': 'taxi',
    
    # Worship
    'mosque': 'place_of_worship', 'masjid': 'place_of_worship',
    
    # Education
    'school': 'school', 'university': 'university', 'college': 'college',
    'kindergarten': 'kindergarten', 'library': 'library',
    
    # Shops & Retail
    'market': 'marketplace', 'supermarket': 'marketplace', 'mall': 'marketplace',
    'grocery': 'marketplace', 'store': 'marketplace', 'shop': 'marketplace',
    
    # Emergency & Government
    'police': 'police', 'fire': 'fire_station', 'civil defense': 'fire_station',
    'courthouse': 'courthouse', 'prison': 'prison',
    
    # Entertainment
    'cinema': 'cinema', 'theatre': 'theatre', 'museum': 'museum',
    'park': 'park', 'beach': 'beach', 'hotel': 'hotel', 'lounge': 'cafe',
    
    # Car services
    'car wash': 'car_wash', 'car care': 'car_wash', 'auto': 'car_repair',
    
    # Other
    'post': 'post_office', 'dhl': 'post_office', 'events': 'events_venue',
    'water': 'drinking_water', 'ferry': 'ferry_terminal'
}

def infer_category(name):
    """Infer category from name keywords"""
    if not name:
        return None
    
    name_lower = name.lower()
    
    # Check keyword mappings
    for keyword, category in KEYWORD_CATEGORY_MAP.items():
        if keyword in name_lower:
            return category
    
    # Suffix-based fallbacks
    if name_lower.endswith('cafe') or name_lower.endswith('coffee'):
        return 'cafe'
    if name_lower.endswith('restaurant') or name_lower.endswith('resturant'):
        return 'restaurant'
    if name_lower.endswith('hospital'):
        return 'hospital'
    if name_lower.endswith('pharmacy'):
        return 'pharmacy'
    if name_lower.endswith('school'):
        return 'school'
    if name_lower.endswith('mosque') or name_lower.endswith('masjid'):
        return 'place_of_worship'
    if name_lower.endswith('bank'):
        return 'bank'
    if name_lower.endswith('station'):
        return 'fuel'
    if name_lower.endswith('hotel'):
        return 'hotel'
    if name_lower.endswith('market') or name_lower.endswith('mart'):
        return 'marketplace'
    
    return None

def fill_null_categories(input_file, output_file):
    """Read JSONL file, fill null categories based on name, write updated file"""
    
    updated_count = 0
    kept_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        for line_num, line in enumerate(infile, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                data = json.loads(line)
                name = data.get('name', '')
                category = data.get('category')
                
                # If category is null or 'null', try to infer from name
                if category is None or category == 'null':
                    inferred = infer_category(name)
                    if inferred:
                        data['category'] = inferred
                        updated_count += 1
                        print(f"Line {line_num}: Set category for '{name[:50]}' to '{inferred}'")
                    else:
                        # Keep as null if no inference possible
                        print(f"Line {line_num}: Could not infer category for '{name[:50]}' - keeping null")
                
                outfile.write(json.dumps(data, ensure_ascii=False) + '\n')
                kept_count += 1
                
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse line {line_num}: {e}")
                continue
    
    print(f"\n{'='*60}")
    print(f"RESULTS")
    print(f"{'='*60}")
    print(f"Total lines processed: {kept_count}")
    print(f"Categories updated: {updated_count}")
    print(f"Output saved to: {output_file}")
    print(f"{'='*60}")

# Run the script
if __name__ == "__main__":
    INPUT_FILE = "filtered_no_arabic.jsonl"    # Your file without Arabic names
    OUTPUT_FILE = "filtered_with_categories.jsonl"  # Output with categories filled
    
    fill_null_categories(INPUT_FILE, OUTPUT_FILE)