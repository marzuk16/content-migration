#!/bin/bash

directory="./data/input"

output_file="./data/output/file_names.txt"

ls "$directory" | paste -sd "," - > "$output_file"

echo "File names have been exported to $output_file"
