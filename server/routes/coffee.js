import { Router } from "express";
import { getPool, hasDb } from "../lib/db.js";
import { requireAllowedUser } from "../lib/auth.js";

const router = Router();

// In-memory store used when DATABASE_URL is missing. Resets on restart.
const memoryStore = [];

function mockCoffeeLogs(days = 30) {
  // A few realistic coffee logs scattered across the last `days`.
  const now = Date.now();
  const day = 86400_000;
  const pattern = [0.5, 1.4, 2.6, 3.5, 4.5, 5.6, 7.4, 9.5, 11.4, 12.6, 14.5, 15.4, 17.5, 18.6, 21.4];
  return pattern
    .filter((d) => d <= days)
    .map((d, i) => ({
      id: i + 1,
      logged_at: new Date(now - d * day - (i % 3) * 3600_000 - 7 * 3600_000).toISOString(),
      notes: i % 4 === 0 ? "iced" : null,
    }));
}

router.get("/", async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();

  if (process.env.MOCK_DATA === "true" || !hasDb()) {
    res.set("X-Data-Source", "mock");
    return res.json({
      source: "mock",
      logs: [...memoryStore, ...mockCoffeeLogs(days)].sort(
        (a, b) => +new Date(b.logged_at) - +new Date(a.logged_at)
      ),
    });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, logged_at, notes
         FROM coffee_logs
        WHERE logged_at >= $1
        ORDER BY logged_at DESC`,
      [cutoff]
    );
    res.set("X-Data-Source", "postgres");
    res.json({ source: "postgres", logs: rows });
  } catch (err) {
    console.error("[/api/coffee GET] db query failed:", err.message);
    res.status(500).json({ error: "query_failed" });
  }
});

router.post("/", requireAllowedUser, async (req, res) => {
  const notes = typeof req.body?.notes === "string" ? req.body.notes.slice(0, 280) : null;
  const logged_at = req.body?.logged_at
    ? new Date(req.body.logged_at).toISOString()
    : new Date().toISOString();

  if (!hasDb()) {
    const entry = { id: memoryStore.length + 1, user_email: req.user.email, logged_at, notes };
    memoryStore.unshift(entry);
    res.set("X-Data-Source", "memory");
    return res.status(201).json({ source: "memory", log: entry });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO coffee_logs (user_email, logged_at, notes)
       VALUES ($1, $2, $3)
       RETURNING id, logged_at, notes`,
      [req.user.email, logged_at, notes]
    );
    res.set("X-Data-Source", "postgres");
    res.status(201).json({ source: "postgres", log: rows[0] });
  } catch (err) {
    console.error("[/api/coffee POST] insert failed:", err.message);
    res.status(500).json({ error: "insert_failed" });
  }
});

export default router;
