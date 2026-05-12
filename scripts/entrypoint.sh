#!/bin/sh
set -e

echo "Running database schema push..."
cd /app
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss 2>&1 || echo "Schema push skipped"

echo "Seeding forum categories..."
node /app/scripts/seed-community.mjs 2>&1 || echo "Seed skipped"

# Warm caches in background after server starts
(
  sleep 15
  echo "Warming caches..."
  curl -sf -X POST "http://localhost:3000/api/cache/refresh?secret=${CRON_SECRET:-dota2-refresh-2026}" > /dev/null 2>&1 && echo "Cache warm complete" || echo "Cache warm failed"
) &

echo "Starting Next.js..."
exec node server.js
