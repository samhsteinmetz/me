// Applies schema.sql to the database in DATABASE_URL. Run once after creating
// the Heroku Postgres add-on:  npm run db:init
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env and try again.");
  process.exit(1);
}

const sql = readFileSync(join(__dirname, "..", "schema.sql"), "utf8");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /amazonaws\.com|herokuapp|render\.com|sslmode=require/i.test(
    process.env.DATABASE_URL
  )
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  await pool.query(sql);
  console.log("Schema applied.");
} catch (err) {
  console.error("Failed to apply schema:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
