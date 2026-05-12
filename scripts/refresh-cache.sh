#!/bin/sh
# Called by crontab every 30 minutes to keep API caches warm.
# Hits the Next.js server on localhost (not exposed externally).
set -e
curl -sf -X POST "http://localhost:3000/api/cache/refresh?secret=${CRON_SECRET:-dota2-refresh-2026}" > /dev/null 2>&1 || true
