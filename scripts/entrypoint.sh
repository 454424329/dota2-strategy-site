#!/bin/sh
set -e

echo "Running database migrations..."
cd /app
npx prisma migrate deploy --schema=prisma/schema.prisma 2>/dev/null || echo "Migration skipped (no changes or DB not ready)"

echo "Seeding forum categories..."
node /app/scripts/seed-community.mjs 2>/dev/null || echo "Seed skipped"

echo "Starting Next.js..."
exec node server.js
