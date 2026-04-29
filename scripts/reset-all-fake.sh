#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/saasan-be-nest"

echo "Resetting seeded fake data..."
cd "$BACKEND_DIR"
pnpm reset:fake-data

echo "Seeded fake data reset completed."
