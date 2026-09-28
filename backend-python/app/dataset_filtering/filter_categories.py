import json
import re

# Define keyword-to-category mappings based on common patterns in your data
KEYWORD_CATEGORY_MAP = {
    # Food & Beverage
    'cafe': 'cafe',
    'coffee': 'cafe',
    'coffe': 'cafe',
    'restaurant': 'restaurant',
    'kitchen': 'restaurant',
    'grill': 'restaurant',
    'pizza': 'fast_food',
    'burger': 'fast_food',
    'kfc': 'fast_food',
    'kudu': 'fast_food',
    'herfy': 'fast_food',
    'hardee': 'fast_food',
    'mcdonald': 'fast_food',
    'domino': 'fast_food',
    'papa john': 'fast_food',
    'subway': 'fast_food',
    'shawarma': 'fast_food',
    'broast': 'fast_food',
    'dunkin': 'fast_food',
    'krispy': 'fast_food',
    'baskin': 'ice_cream',
    'ice cream': 'ice_cream',
    'juice': 'fast_food',
    'bakery': 'bakery',
    
    # Healthcare
    'hospital': 'hospital',
    'clinic': 'clinic',
    'pharmacy': 'pharmacy',
    'medical': 'clinic',
    'health': 'clinic',
    'doctor': 'doctors',
    'dentist': 'dentist',
    'veterinary': 'veterinary',
    
    # Financial
    'bank': 'bank',
    'atm': 'atm',
    'riyad bank': 'bank',
    'sabb': 'bank',
    'ncb': 'bank',
    'samba': 'bank',
    'alrajhi': 'bank',
    'saudi national bank': 'bank',
    'western union': 'money_transfer',
    'money transfer': 'money_transfer',
    
    # Fuel & Transport
    'fuel': 'fuel',
    'gas station': 'fuel',
    'petrol': 'fuel',
    'naft': 'fuel',
    'sasco': 'fuel',
    'aldrees': 'fuel',
    'petromin': 'fuel',
    'bus': 'bus_station',
    'saptco': 'bus_station',
    'car rental': 'car_rental',
    'rent a car': 'car_rental',
    'taxi': 'taxi',
    
    # Worship
    'mosque': 'place_of_worship',
    'masjid': 'place_of_worship',
    'musalla': 'place_of_worship',
    
    # Education
    'school': 'school',
    'university': 'university',
    'college': 'college',
    'kindergarten': 'kindergarten',
    'library': 'library',
    
    # Shops & Retail
    'market': 'marketplace',
    'supermarket': 'marketplace',
    'hypermarket': 'marketplace',
    'mall': 'marketplace',
    'grocery': 'marketplace',
    'bakala': 'marketplace',
    'baqala': 'marketplace',
    'store': 'marketplace',
    'shop': 'marketplace',
    
    # Emergency & Government
    'police': 'police',
    'fire': 'fire_station',
    'civil defense': 'fire_station',
    'courthouse': 'courthouse',
    'prison': 'prison',
    
    # Entertainment
    'cinema': 'cinema',
    'theatre': 'theatre',
    'museum': 'museum',
    'park': 'park',
    'beach': 'beach',
    'cafe': 'cafe',
    'hotel': 'hotel',
    'lounge': 'cafe',
    
    # Car services
    'car wash': 'car_wash',
    'car care': 'car_wash',
    'workshop': 'workshop',
    'auto': 'car_repair',
    'tire': 'car_repair',
    
    # Other
    'post': 'post_office',
    'dhl': 'post_office',
    'courier': 'post_office',
    'post_office': 'post_office',
    'community': 'community_centre',
    'events': 'events_venue',
    'water': 'drinking_water',
    'ferry': 'ferry_terminal',
    'fuel': 'fuel',
}

def contains_arabic(text):
    """Check if text contains any Arabic Unicode characters"""
    if not text:
        return False
    # Arabic Unicode range: \u0600-\u06FF, \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFF
    arabic_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
    return bool(arabic_pattern.search(text))

def infer_category(name):
    """Infer category based on name keywords"""
    if not name:
        return None
    
    name_lower = name.lower()
    
    # Check for matches in keyword map
    for keyword, category in KEYWORD_CATEGORY_MAP.items():
        if keyword in name_lower:
            return category
    
    # Additional specific pattern matching
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
    if name_lower.startswith('al ') and len(name_lower) > 3:
        # Generic fallback for Arabic-named places
        pass
    
    return None

def process_file(input_file, output_file):
    """Process the JSON lines file, filter Arabic names and fill null categories"""
    kept_lines = 0
    removed_lines = 0
    updated_categories = 0
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        for line_num, line in enumerate(infile, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                data = json.loads(line)
                name = data.get('name', '')
                
                # Skip lines with Arabic names
                if contains_arabic(name):
                    removed_lines += 1
                    print(f"Removed line {line_num}: {name[:50]}... (contains Arabic)")
                    continue
                
                # If category is null, try to infer from name
                if data.get('category') is None or data.get('category') == 'null':
                    inferred = infer_category(name)
                    if inferred:
                        data['category'] = inferred
                        updated_categories += 1
                        print(f"Line {line_num}: Set category for '{name[:40]}...' to '{inferred}'")
                
                # Write the processed line
                outfile.write(json.dumps(data, ensure_ascii=False) + '\n')
                kept_lines += 1
                
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse line {line_num}: {e}")
                continue
    
    print(f"\n{'='*50}")
    print(f"Processing complete!")
    print(f"Lines kept: {kept_lines}")
    print(f"Lines removed (Arabic names): {removed_lines}")
    print(f"Categories updated: {updated_categories}")
    print(f"Output saved to: {output_file}")
    print(f"{'='*50}")

# Run the processing
if __name__ == "__main__":
    input_file = "output_test2.txt"  # Your input file
    output_file = "output_filtered.txt"  # Output file
    
    process_file(input_file, output_file)