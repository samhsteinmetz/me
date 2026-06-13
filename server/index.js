// index.js — Express app entry point. Deploys to Heroku separately from the
// React frontend (which lives on GitHub Pages).
//
// CORS is locked to a single origin via ALLOWED_ORIGIN so it can be changed
// without code edits. In local dev, common Vite origins are also allowed.

import "dotenv/config";
import express from "express";
import cors from "cors";

import hrRoutes from "./routes/hr.js";
import vixRoutes from "./routes/vix.js";
import coffeeRoutes from "./routes/coffee.js";
import { hasDb } from "./db.js";
import { hasAuth } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowed = [
  process.env.ALLOWED_ORIGIN,
  // Convenience defaults for local frontend dev.
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (curl, health checks) with no Origin header.
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "16kb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    db: hasDb(),
    auth: hasAuth(),
    mock: process.env.MOCK_DATA === "true",
  });
});

// hr routes include both /api/hr and /api/hr-intraday.
app.use("/api", hrRoutes);
app.use("/api/vix", vixRoutes);
app.use("/api/coffee", coffeeRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`vitals api on :${PORT}  (db=${hasDb()} auth=${hasAuth()} mock=${process.env.MOCK_DATA === "true"})`);
});
