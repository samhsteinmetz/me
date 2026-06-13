// index.js — Express app entry point. Deploys (e.g. to Render) separately from
// the React frontend, which lives on GitHub Pages.
//
// CORS is locked to ALLOWED_ORIGIN (comma-separated list supported) so it can
// be changed without code edits. No wildcard is ever used.

import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import hrRoutes from "./routes/hr.js";
import vixRoutes from "./routes/vix.js";
import coffeeRoutes from "./routes/coffee.js";
import { hasDb } from "./db.js";
import { hasAuth } from "./middleware/auth.js";
import { hasGoogleHealth } from "./googleHealth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Only origins listed in ALLOWED_ORIGIN are permitted (comma-separated).
const allowed = (process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (curl, Render health checks) with no Origin.
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "16kb" }));

// Liveness probe for Render. No auth required.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    db: hasDb(),
    auth: hasAuth(),
    googleHealth: hasGoogleHealth(),
    mock: process.env.MOCK_DATA === "true",
  });
});

// Google OAuth flow (one-time token minting).
app.use("/", authRoutes);

// hr routes include both /api/hr and /api/hr-intraday.
app.use("/api", hrRoutes);
app.use("/api/vix", vixRoutes);
app.use("/api/coffee", coffeeRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(
    `vitals api on :${PORT}  (db=${hasDb()} auth=${hasAuth()} ` +
      `googleHealth=${hasGoogleHealth()} mock=${process.env.MOCK_DATA === "true"})`
  );
});
