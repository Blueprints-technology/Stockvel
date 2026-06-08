#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing dependencies..."
npm install

echo "🔑 Preparing environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ✅ Created .env from .env.example"
fi

echo "🔍 Infrastructure check..."
echo "   ⚠️  PostgreSQL and Redis must be running locally."
echo "   💡 Update your .env with local connection strings:"
echo "     DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/stockvel_db"
echo "     REDIS_URL=redis://localhost:6379"

# Optional non-blocking connectivity hints
if command -v redis-cli &> /dev/null; then
  REDIS_URL=$(grep -E '^REDIS_URL=' .env | cut -d'=' -f2- || echo "")
  if [ -n "$REDIS_URL" ] && redis-cli -u "$REDIS_URL" ping 2>/dev/null | grep -q "PONG"; then
    echo "   ✅ Redis is reachable"
  else
    echo "   ⚠️  Redis not responding. Ensure it's running."
  fi
fi

echo "⚙️  Running Prisma generate & migrations..."
npm run prisma:generate --workspace @fmp/api

# Check if migrations folder is empty (first run)
if [ -z "$(ls -A apps/api/prisma/migrations 2>/dev/null)" ]; then
  echo "   🆕 First run: creating initial migration..."
  npm run prisma:migrate:dev --workspace @fmp/api -- --name init
else
  echo "   🔄 Applying existing migrations..."
  # If deploy fails (e.g., database is dirty), automatically force a reset
  npm run prisma:migrate:deploy --workspace @fmp/api || npm run prisma:migrate:reset --workspace @fmp/api
fi

npm run prisma:seed --workspace @fmp/api

echo ""
echo "✅ Setup complete!"
echo "🚀 Start the apps with:"
echo "   npm run dev:api"
echo "   npm run dev:web"
