#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/saasan-be-nest"

echo "Deleting all non-location data while preserving provinces, districts, constituencies, municipalities, and wards..."
cd "$BACKEND_DIR"
pnpm reset:preserve-locations

echo "Non-location data deleted successfully."

echo "Seeding politics reference data..."
pnpm seed:politics

echo "Seeding poll reference data..."
pnpm seed:poll

echo "Seeding dependent fake users, reports, cases, events, votes, and messages..."
pnpm seed:fake-data

echo "Fake data seeding completed."
