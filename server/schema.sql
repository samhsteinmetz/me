-- schema.sql — run once against your Postgres instance.
--
-- Heroku:   heroku pg:psql --app <your-app> < server/schema.sql
-- Local:    psql "$DATABASE_URL" -f server/schema.sql
-- Or:       npm run db:init   (from the server/ folder)

CREATE TABLE IF NOT EXISTS coffee_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reads are always "most recent first"; index the sort column.
CREATE INDEX IF NOT EXISTS idx_coffee_logs_timestamp
  ON coffee_logs (timestamp DESC);
