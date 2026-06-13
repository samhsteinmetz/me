import pg from "pg";

let pool = null;

export function getPool() {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) return null;

  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("amazonaws.com")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return pool;
}

export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}
