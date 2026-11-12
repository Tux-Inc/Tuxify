#!/bin/bash

# This script installs packages in every backend subfolder containing a package.json file using yarn.

set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing packages in backend subfolders..."

for dir in "$BASE_DIR"/*/; do
	if [ -f "$dir/package.json" ]; then
		echo "\nInstalling in $dir"
		(cd "$dir" && yarn install)
	fi
done

EXTERNAL_PROVIDERS_DIR="$BASE_DIR/external-providers"

if [ -d "$EXTERNAL_PROVIDERS_DIR" ]; then
	echo "\nInstalling packages in external-providers subfolders..."
	for dir in "$EXTERNAL_PROVIDERS_DIR"/*/; do
		if [ -f "$dir/package.json" ]; then
			echo "\nInstalling in $dir"
			(cd "$dir" && yarn install)
		fi
	done
fi

echo "All installations complete."
