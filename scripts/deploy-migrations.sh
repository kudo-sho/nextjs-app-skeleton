#!/bin/bash
set -e

echo "🚀 Starting deployment migrations..."

# Check if we're in a deployment environment
if [ "$VERCEL_ENV" = "production" ] || [ "$VERCEL_ENV" = "preview" ]; then
  echo "📍 Environment: $VERCEL_ENV"

  # Check required environment variables
  if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Error: SUPABASE_ACCESS_TOKEN is not set"
    exit 1
  fi

  if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ Error: SUPABASE_PROJECT_ID is not set"
    exit 1
  fi

  if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "❌ Error: SUPABASE_DB_PASSWORD is not set"
    exit 1
  fi

  # Link to Supabase project
  echo "🔗 Linking to Supabase project..."
  npx supabase link --project-ref "$SUPABASE_PROJECT_ID" --password "$SUPABASE_DB_PASSWORD"

  # Run Prisma migrations
  echo "📊 Running Prisma migrations..."
  npx prisma migrate deploy

  # Run Supabase migrations (RLS, functions, triggers)
  echo "🔐 Running Supabase migrations (RLS/Functions)..."
  npx supabase migration up --linked

  echo "✅ All migrations completed successfully"
else
  echo "⏭️  Skipping deployment migrations (not in deployment environment)"
  echo "   For local development, use: npm run db:migrate"
fi
