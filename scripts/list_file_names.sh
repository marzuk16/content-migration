#!/bin/bash

directory="./data/input"
output_file="./data/output/file_names.txt"
ls "$directory" | paste -sd "," - > "$output_file"

echo "File names have been exported to $output_file"


# print in a terminal
    # Without newline
# ls -p | grep -v / | tr '\n' ','
    # With newline
# ls -p | grep -v /

# File names as a string by comma seperated
# ls -p | grep -v / | sed 's/"/\\"/g' | sed 's/\(.*\)/"\1"/' | tr '\n' ',' | sed 's/,$//'