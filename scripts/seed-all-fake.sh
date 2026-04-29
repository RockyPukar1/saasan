#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/saasan-be-nest"

echo "Seeding base location data..."
cd "$BACKEND_DIR"
pnpm seed:location

echo "Seeding politics reference data..."
pnpm seed:politics

echo "Seeding poll reference data..."
pnpm seed:poll

echo "Seeding dependent fake users, reports, cases, events, votes, and messages..."
pnpm seed:fake-data

echo "Fake data seeding completed."
