#!/bin/sh
set -e

echo "Running database schema push..."
cd /app
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss 2>&1 || echo "Schema push skipped"

echo "Seeding forum categories..."
node /app/scripts/seed-community.mjs 2>&1 || echo "Seed skipped"

echo "Starting Next.js..."
exec node server.js
