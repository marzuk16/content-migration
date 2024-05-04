#!/bin/bash

directory="../data/input"

declare -A file_hashes

for file in "$directory"/*; do
    if [ -f "$file" ]; then
        file_hash=$(md5sum "$file" | awk '{print $1}')

        ((file_hashes[$file_hash]++))
    fi
done

echo "Duplicate Files:"
for hash in "${!file_hashes[@]}"; do
    if [ "${file_hashes[$hash]}" -gt 1 ]; then
        echo "Hash: $hash"
        grep -F "$hash" "$directory"/*
    fi
done
