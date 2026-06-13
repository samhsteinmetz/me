-- Run once on your Heroku Postgres instance, or via `npm run db:init`.

CREATE TABLE IF NOT EXISTS coffee_logs (
  id           SERIAL PRIMARY KEY,
  user_email   TEXT        NOT NULL,
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_coffee_logs_logged_at
  ON coffee_logs (logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_coffee_logs_user_email
  ON coffee_logs (user_email);
