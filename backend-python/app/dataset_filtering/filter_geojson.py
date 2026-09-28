#!/usr/bin/env python3
"""
Filter a large GeoJSON dataset, clean fields, remove duplicates, and output JSON Lines.
Optionally load the result into PostgreSQL.
"""

import ijson
import argparse
import json
import re
from pathlib import Path

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------

# Fields we extract from GeoJSON properties
FIELD_MAPPING = {
    "name_en": "name:en",   # priority name field
    "name": "name",         # fallback name field
    "city": "addr:city",
    "category": "amenity"
}

# ----------------------------------------------------------------------
# Helper functions
# ----------------------------------------------------------------------

def is_english_text(text):
    """Return True if text contains only ASCII letters, spaces, digits, and common punctuation."""
    if text is None:
        return False
    # Allow letters (A-Z a-z), digits, spaces, hyphens, apostrophes, periods, commas, parentheses
    pattern = r'^[A-Za-z0-9\s\-\.\,\'\(\)]+$'
    return bool(re.match(pattern, text.strip()))

def extract_name(properties):
    """Extract name: first try 'name:en', then 'name'. Return None if both missing."""
    name = properties.get("name:en")
    if name and isinstance(name, str) and name.strip():
        return name.strip()
    name = properties.get("name")
    if name and isinstance(name, str) and name.strip():
        return name.strip()
    return None

def extract_city(properties):
    """Extract city from addr:city, only if it's English text, else None."""
    city = properties.get("addr:city")
    if city and isinstance(city, str) and is_english_text(city):
        return city.strip()
    return None

def extract_category(properties):
    """Extract amenity value (category)."""
    cat = properties.get("amenity")
    if cat and isinstance(cat, str) and cat.strip():
        return cat.strip()
    return None

def build_location(geometry):
    """
    Extract coordinates from GeoJSON geometry.
    Returns dict with latitude, longitude, addressDetails (always null).
    If coordinates missing/invalid, returns None.
    """
    if not geometry:
        return None
    coords = geometry.get("coordinates")
    if not coords or not isinstance(coords, (list, tuple)) or len(coords) < 2:
        return None
    # GeoJSON: [longitude, latitude]
    lon, lat = coords[0], coords[1]
    # Validate numeric
    try:
        lon = float(lon)
        lat = float(lat)
    except (TypeError, ValueError):
        return None
    return {
        "latitude": lat,
        "longitude": lon,
        "addressDetails": None
    }

def create_output_record(feature, seq_id):
    """Transform a GeoJSON feature into the target DTO (PlaceDetailResponseDTO shape)."""
    props = feature.get("properties", {})
    
    # Name (required - if None, record will be dropped)
    name = extract_name(props)
    if name is None:
        return None
    
    # City
    city = extract_city(props)
    
    # Category (amenity)
    category = extract_category(props)
    
    # Location from geometry
    geometry = feature.get("geometry")
    location = build_location(geometry)
    
    # Build the output object
    record = {
        "id": seq_id,
        "name": name,
        "description": None,
        "city": city,
        "category": category,
        "imageURL": None,
        "rate": None,
        "location": location,
        "schedule": None,
        "type": None
    }
    return record

# ----------------------------------------------------------------------
# Main filtering and writing
# ----------------------------------------------------------------------

def process_geojson(input_path, output_path):
    """
    Stream read GeoJSON, filter duplicates by name, write JSON Lines.
    Returns number of records written.
    """
    seen_names = set()
    records_written = 0
    next_id = 1
    
    # Open input and output files
    with open(input_path, 'rb') as infile, open(output_path, 'w', encoding='utf-8') as outfile:
        # Parse the GeoJSON array 'features' one item at a time
        parser = ijson.items(infile, 'features.item')
        for feature in parser:
            # Extract name for duplicate detection
            props = feature.get("properties", {})
            name = extract_name(props)
            if name is None:
                continue   # drop feature without a name
            
            # Normalize name for duplicate check
            norm_name = name.strip().lower()
            if norm_name in seen_names:
                continue   # duplicate - skip
            seen_names.add(norm_name)
            
            # Create output record
            record = create_output_record(feature, next_id)
            if record is None:
                continue   # should not happen because name exists, but safety
            
            # Write as JSON line
            outfile.write(json.dumps(record, ensure_ascii=False) + '\n')
            records_written += 1
            next_id += 1
    
    return records_written

# ----------------------------------------------------------------------
# PostgreSQL load function
# ----------------------------------------------------------------------

def load_to_postgres(jsonl_path, table_name, db_connection_string):
    """
    Load JSON Lines file into a PostgreSQL table.
    Assumes table has columns matching the output DTO structure.
    db_connection_string: e.g., "postgresql://user:pass@localhost/dbname"
    """
    import psycopg2
    from psycopg2.extras import Json
    
    conn = psycopg2.connect(db_connection_string)
    cur = conn.cursor()
    
    # Prepare COPY from JSON lines (requires PostgreSQL 9.4+)
    # We'll use a temporary staging table or direct INSERT with jsonb.
    # Simpler: iterate lines and insert (not fastest but works for moderate size).
    # For huge datasets, use COPY with a proper schema.
    
    # Let's create a temporary table that matches the JSON structure,
    # then COPY and transform.
    
    cur.execute("""
        CREATE TEMP TABLE temp_json_import (data jsonb);
    """)
    
    # Use COPY to load raw JSON lines
    with open(jsonl_path, 'r') as f:
        cur.copy_expert("COPY temp_json_import (data) FROM STDIN", f)
    
    # Now insert into the actual table (adjust column names as needed)
    # Assuming table has columns: id, name, description, city, category, imageURL,
    # rate, location (jsonb), schedule (jsonb), type
    cur.execute(f"""
        INSERT INTO {table_name} (id, name, description, city, category, imageURL, rate, location, schedule, type)
        SELECT 
            (data->>'id')::bigint,
            data->>'name',
            data->>'description',
            data->>'city',
            data->>'category',
            data->>'imageURL',
            (data->>'rate')::double precision,
            data->'location',
            data->'schedule',
            data->>'type'
        FROM temp_json_import
        WHERE data->>'name' IS NOT NULL
        ON CONFLICT (id) DO NOTHING;
    """)
    
    conn.commit()
    cur.execute("DROP TABLE temp_json_import")
    cur.close()
    conn.close()
    print(f"Loaded into {table_name}")

# ----------------------------------------------------------------------
# Command line interface
# ----------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Filter GeoJSON to JSON Lines for PostgreSQL")
    parser.add_argument("input", help="Input GeoJSON file path")
    parser.add_argument("output", help="Output JSON Lines file path")
    parser.add_argument("--load-db", help="PostgreSQL connection string to load after filtering", default=None)
    parser.add_argument("--table", help="Target table name for loading (required if --load-db used)", default="places")
    args = parser.parse_args()
    
    print(f"Processing {args.input} -> {args.output}")
    count = process_geojson(args.input, args.output)
    print(f"Done. Wrote {count} records.")
    
    if args.load_db:
        print(f"Loading into PostgreSQL table {args.table}...")
        load_to_postgres(args.output, args.table, args.load_db)
        print("Loading complete.")

if __name__ == "__main__":
    main()