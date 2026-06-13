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
// The pool reads its connection string from DATABASE_URL (Heroku sets this
// automatically when you attach the Heroku Postgres add-on). SSL is enabled
// for managed providers (Heroku) and skipped for plain local Postgres.

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

  const isManaged =
    /amazonaws\.com|herokuapp|render\.com|\bsslmode=require\b/i.test(
      process.env.DATABASE_URL
    );

  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // Heroku Postgres uses self-signed certs; relax verification there only.
    ssl: isManaged ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

/** @returns {boolean} whether a database connection string is configured. */
export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}
