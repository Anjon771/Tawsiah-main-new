import json
import re

def remove_arabic_names(input_file, output_file):
    """
    Reads JSONL file, keeps only lines where 'name' has no Arabic characters.
    """
    # Regex for Arabic Unicode range (basic Arabic + extensions)
    arabic_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
    
    kept_count = 0
    removed_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        for line_num, line in enumerate(infile, 1):
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
                name = record.get('name', '')
                # If name contains any Arabic character, skip this line
                if arabic_pattern.search(name):
                    removed_count += 1
                    continue
                # Otherwise write the line as is
                outfile.write(line + '\n')
                kept_count += 1
            except json.JSONDecodeError:
                print(f"Warning: Skipping invalid JSON at line {line_num}")
                removed_count += 1
    
    print(f"Done. Kept: {kept_count}, Removed (Arabic names): {removed_count}")

if __name__ == '__main__':
    # Change these filenames as needed
    remove_arabic_names('output.jsonl', 'filtered_no_arabic.jsonl')