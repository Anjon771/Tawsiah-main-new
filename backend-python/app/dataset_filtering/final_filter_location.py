import json
import os

def add_coordinates_by_name(geojson_file, filtered_file, output_file):
    """Match names between GeoJSON and filtered JSONL file, add coordinates to location field"""
    
    # Check if files exist
    if not os.path.exists(geojson_file):
        print(f"❌ ERROR: GeoJSON file not found at: {geojson_file}")
        print(f"   Current working directory: {os.getcwd()}")
        return
    
    if not os.path.exists(filtered_file):
        print(f"❌ ERROR: Filtered file not found at: {filtered_file}")
        print(f"   Current working directory: {os.getcwd()}")
        return
    
    # Step 1: Load all coordinates from original GEOJSON file into a dictionary (key = name)
    print(f"Loading coordinates from GeoJSON: {geojson_file}")
    coordinates_map = {}
    total_geojson = 0
    
    with open(geojson_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
        # Handle GeoJSON FeatureCollection format
        if 'features' in data:
            for feature in data['features']:
                total_geojson += 1
                props = feature.get('properties', {})
                name = props.get('name')
                coords = feature.get('geometry', {}).get('coordinates')
                
                if name and coords:
                    coordinates_map[name] = coords
        # Handle array format
        elif isinstance(data, list):
            for feature in data:
                total_geojson += 1
                props = feature.get('properties', {})
                name = props.get('name')
                coords = feature.get('geometry', {}).get('coordinates')
                
                if name and coords:
                    coordinates_map[name] = coords
    
    print(f"Loaded {len(coordinates_map)} coordinates from {total_geojson} total features in GeoJSON")
    
    # Step 2: Read filtered JSONL file and add coordinates where name matches
    print(f"\nProcessing filtered JSONL file: {filtered_file}")
    matched = 0
    not_matched = 0
    output_lines = []
    
    with open(filtered_file, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                data = json.loads(line)
                name = data.get('name', '')
                
                # Try to match by name
                if name in coordinates_map:
                    data['location'] = coordinates_map[name]
                    matched += 1
                    if matched <= 5:  # Print first 5 matches as example
                        print(f"  ✓ Matched: {name[:50]}...")
                else:
                    data['location'] = None
                    not_matched += 1
                    if not_matched <= 5:  # Print first 5 non-matches as example
                        print(f"  ✗ No match: {name[:50]}...")
                
                output_lines.append(json.dumps(data, ensure_ascii=False))
                
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse line {line_num}: {e}")
                continue
    
    # Step 3: Write the output JSONL file
    with open(output_file, 'w', encoding='utf-8') as f:
        for line in output_lines:
            f.write(line + '\n')
    
    print(f"\n{'='*60}")
    print(f"RESULTS")
    print(f"{'='*60}")
    print(f"Total lines in filtered file: {len(output_lines)}")
    print(f"Coordinates matched and added: {matched}")
    print(f"Names not found in GeoJSON: {not_matched}")
    print(f"Output saved to: {output_file}")
    print(f"{'='*60}")

# Run the matching
if __name__ == "__main__":
    # Set your file paths
    GEOJSON_FILE = "input.geojson"              # Your original GeoJSON file
    FILTERED_FILE = "output_final.jsonl"        # Your filtered JSONL file
    OUTPUT_FILE = "output_with_locations.jsonl" # Final output with coordinates
    
    # If files are in a different directory, use full paths like:
    # GEOJSON_FILE = r"C:\Users\PC\Desktop\Tawsiah\backend-python\app\dataset_filtering\input.geojson"
    # FILTERED_FILE = r"C:\Users\PC\Desktop\Tawsiah\backend-python\app\dataset_filtering\output_final.jsonl"
    # OUTPUT_FILE = r"C:\Users\PC\Desktop\Tawsiah\backend-python\app\dataset_filtering\output_with_locations.jsonl"
    
    add_coordinates_by_name(GEOJSON_FILE, FILTERED_FILE, OUTPUT_FILE)