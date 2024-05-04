#!/bin/bash

# To run this script
# chmod +x file_sizes.sh
# ./file_sizes.sh

directory="./data/input"
content_file_sizes="./data/input/content_file_sizes.csv"

# Header for the CSV file
echo "File Name,Size (MB)" > "$content_file_sizes"

for file in "$directory"/*; do
    # Check if the file is a regular file
    if [ -f "$file" ]; then
        file_size=$(stat -c %s "$file")
        file_size_mb=$(echo "scale=2; $file_size / 1024 / 1024" | bc)

        file_name=$(basename "$file")

        echo "$file_name,$file_size_mb" >> "$content_file_sizes"
    fi
done

echo "File sizes have been saved to $csv_file"
