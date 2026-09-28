import json

def remove_null_categories(input_file, output_file):
    """Remove lines where category is null or 'null'"""
    kept_lines = 0
    removed_lines = 0
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        for line_num, line in enumerate(infile, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                data = json.loads(line)
                category = data.get('category')
                
                # Check if category is null, None, or 'null' string
                if category is None or category == 'null' or str(category).lower() == 'null':
                    removed_lines += 1
                    name = data.get('name', 'Unknown')
                    print(f"Removed line {line_num}: '{name[:50]}...' (category = {category})")
                else:
                    outfile.write(json.dumps(data, ensure_ascii=False) + '\n')
                    kept_lines += 1
                    
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse line {line_num}: {e}")
                continue
    
    print(f"\n{'='*50}")
    print(f"Processing complete!")
    print(f"Lines kept (with valid categories): {kept_lines}")
    print(f"Lines removed (null categories): {removed_lines}")
    print(f"Output saved to: {output_file}")
    print(f"{'='*50}")

# Run the processing
if __name__ == "__main__":
    input_file = "output_filtered.txt"  # Your filtered file from previous step
    output_file = "output_final.txt"    # Final clean output
    
    remove_null_categories(input_file, output_file)