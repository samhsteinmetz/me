// db.js — Postgres connection pool shared across all route files.
//
// Run the schema once before first use (also lives in schema.sql):
//
//   CREATE TABLE IF NOT EXISTS coffee_logs (
//     id SERIAL PRIMARY KEY,
//     timestamp TIMESTAMPTZ NOT NULL,
//     notes TEXT,
//     created_at TIMESTAMPTZ DEFAULT NOW()
//   );
//
// The pool reads its connection string from DATABASE_URL. SSL is enabled for
// any remote host (Neon, Supabase, Render, Heroku, etc.) and skipped only for
// plain local Postgres.

import pg from "pg";

let pool = null;

/**
 * Lazily build and return the shared pg Pool. Returns null when DATABASE_URL
 * is not configured so callers can fall back to mock data in local dev.
 * @returns {pg.Pool | null}
 */
export function getPool() {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) return null;

  // Managed Postgres (Neon/Supabase/Render/Heroku) requires SSL; local doesn't.
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])(:|\/)/i.test(
    process.env.DATABASE_URL
  );

  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Managed providers use self-signed certs; relax verification for them.
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });

  return pool;
}

/** @returns {boolean} whether a database connection string is configured. */
export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}
