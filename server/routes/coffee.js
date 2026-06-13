// routes/coffee.js — coffee log CRUD.
//
//   GET  /api/coffee  → [{ id, timestamp, notes }]  (most recent first, public)
//   POST /api/coffee  → insert one entry (Firebase auth required)
//
// Falls back to an in-memory store when DATABASE_URL is missing so the panel
// works end-to-end in local dev without Postgres.

import { Router } from "express";
import { getPool, hasDb } from "../db.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = Router();

// In-memory fallback (resets on restart). Mirrors the DB row shape.
const memory = [];
let memoryId = 1000;

// Seed a few mock entries anchored to the same clock hours the intraday mock
// bumps HR (9:15 / 14:15) so the coffee response curve renders in mock mode.
function seedMockCoffee() {
  if (memory.length) return;
  const hours = [
    { h: 9, m: 15, notes: "double espresso" },
    { h: 14, m: 15, notes: null },
  ];
  const now = new Date();
  for (let day = 1; day <= 6; day++) {
    for (const { h, m, notes } of hours) {
      const d = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - day,
        h,
        m,
        0
      );
      memory.push({
        id: memoryId++,
        timestamp: d.toISOString(),
        notes,
      });
    }
  }
  memory.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// Strip any HTML tags and clamp length. Returns null for empty/absent notes.
function sanitizeNotes(raw) {
  if (raw == null) return null;
  if (typeof raw !== "string") return undefined; // signal invalid
  const stripped = raw.replace(/<[^>]*>/g, "").trim();
  if (!stripped) return null;
  return stripped.slice(0, 200);
}

// GET /api/coffee — public, newest first.
router.get("/", async (_req, res) => {
  if (process.env.MOCK_DATA === "true" || !hasDb()) {
    seedMockCoffee();
    res.set("X-Data-Source", "mock");
    return res.json(memory);
  }

  try {
    const { rows } = await getPool().query(
      "SELECT id, timestamp, notes FROM coffee_logs ORDER BY timestamp DESC"
    );
    res.set("X-Data-Source", "postgres");
    res.json(rows);
  } catch (err) {
    console.error("[/api/coffee GET]", err.message);
    res.status(500).json({ error: "Failed to load coffee log" });
  }
});

// POST /api/coffee — requires a valid Firebase ID token.
router.post("/", verifyFirebaseToken, async (req, res) => {
  const ts = req.body?.timestamp;
  if (typeof ts !== "string" || Number.isNaN(Date.parse(ts))) {
    return res.status(400).json({ error: "Invalid timestamp (ISO required)" });
  }
  const timestamp = new Date(ts).toISOString();

  const notes = sanitizeNotes(req.body?.notes);
  if (notes === undefined) {
    return res.status(400).json({ error: "notes must be a string" });
  }

  if (process.env.MOCK_DATA === "true" || !hasDb()) {
    seedMockCoffee();
    const entry = { id: memoryId++, timestamp, notes };
    memory.unshift(entry);
    res.set("X-Data-Source", "memory");
    return res.status(201).json({ success: true, entry });
  }

  try {
    const { rows } = await getPool().query(
      `INSERT INTO coffee_logs (timestamp, notes)
       VALUES ($1, $2)
       RETURNING id, timestamp, notes`,
      [timestamp, notes]
    );
    res.set("X-Data-Source", "postgres");
    res.status(201).json({ success: true, entry: rows[0] });
  } catch (err) {
    console.error("[/api/coffee POST]", err.message);
    res.status(500).json({ error: "Failed to save coffee log" });
  }
});

export default router;
