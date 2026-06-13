import "dotenv/config";
import express from "express";
import cors from "cors";
import hrRoute from "./routes/hr.js";
import vixRoute from "./routes/vix.js";
import coffeeRoute from "./routes/coffee.js";
import { hasFitbit } from "./lib/fitbit.js";
import { hasVix } from "./lib/vix.js";
import { hasDb } from "./lib/db.js";
import { hasAuth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: origins, credentials: false }));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    capabilities: {
      fitbit: hasFitbit(),
      vix: hasVix(),
      db: hasDb(),
      auth: hasAuth(),
      mockMode: process.env.MOCK_DATA === "true",
    },
  });
});

app.use("/api/hr", hrRoute);
app.use("/api/vix", vixRoute);
app.use("/api/coffee", coffeeRoute);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "server_error" });
});

app.listen(PORT, () => {
  const banner = [
    `samhsteinmetz vitals api running on :${PORT}`,
    `  fitbit: ${hasFitbit() ? "configured" : "MOCK"}`,
    `  vix:    ${hasVix() ? "configured" : "MOCK"}`,
    `  db:     ${hasDb() ? "configured" : "MEMORY"}`,
    `  auth:   ${hasAuth() ? "configured" : "DISABLED (no writes)"}`,
  ].join("\n");
  console.log(banner);
});
