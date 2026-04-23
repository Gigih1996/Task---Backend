#!/bin/sh
set -e

echo "╔════════════════════════════════════════╗"
echo "║  Task Management API — Startup          ║"
echo "╚════════════════════════════════════════╝"

echo "[env] NODE_ENV     = ${NODE_ENV:-unset}"
echo "[env] PORT         = ${PORT:-unset}"
echo "[env] DATABASE_URL = $(echo "$DATABASE_URL" | sed -E 's|//([^:]+):[^@]+@|//\1:****@|')"

if [ -z "$DATABASE_URL" ]; then
  echo "✗ FATAL: DATABASE_URL is not set."
  exit 1
fi

echo ""
echo "▶ Step 1/2 — Applying Prisma migrations..."
if npx prisma migrate deploy; then
  echo "✓ Migrations applied successfully."
else
  echo "✗ Migration failed. Aborting."
  exit 1
fi

echo ""
echo "▶ Step 2/2 — Starting NestJS application..."
exec node dist/main.js
