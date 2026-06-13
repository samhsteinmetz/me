// routes/hr.js — Fitbit heart-rate endpoints.
//
//   GET /api/hr            → last 30 days of resting heart rate
//   GET /api/hr-intraday   → per-minute heart rate for a single date (?date=)
//
// Fitbit auth model (personal, single-user app):
//   - We hold a long-lived FITBIT_REFRESH_TOKEN and short-lived access token.
//   - On any 401 we refresh using the client id/secret + refresh token, then
//     persist the new tokens back to tokens.json (fine for a personal app —
//     no multi-user token store needed).
//
// When Fitbit credentials are missing (or MOCK_DATA=true) every endpoint
// returns deterministic mock data so the frontend renders end-to-end in dev.

import { Router } from "express";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = join(__dirname, "..", "tokens.json");
const TOKEN_URL = "https://api.fitbit.com/oauth2/token";

// Coffee bump anchors shared with the mock coffee log so the response-curve
// feature visibly works in mock mode. (clock hours, local time)
const MOCK_COFFEE_HOURS = [{ h: 9, m: 15 }, { h: 14, m: 15 }];

function hasFitbit() {
  return Boolean(
    process.env.FITBIT_CLIENT_ID &&
      process.env.FITBIT_CLIENT_SECRET &&
      (process.env.FITBIT_REFRESH_TOKEN || existsSync(TOKENS_PATH))
  );
}

function useMock() {
  return process.env.MOCK_DATA === "true" || !hasFitbit();
}

// ---- token storage ---------------------------------------------------------

function loadTokens() {
  if (existsSync(TOKENS_PATH)) {
    try {
      return JSON.parse(readFileSync(TOKENS_PATH, "utf8"));
    } catch {
      /* fall through to env */
    }
  }
  return {
    access_token: process.env.FITBIT_ACCESS_TOKEN || null,
    refresh_token: process.env.FITBIT_REFRESH_TOKEN || null,
  };
}

function saveTokens(tokens) {
  try {
    writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
  } catch (err) {
    // On Heroku the filesystem is ephemeral; persisting may fail on read-only
    // dynos. The in-process value is still used until the next restart.
    console.warn("[hr] could not persist tokens.json:", err.message);
  }
}

async function refreshAccessToken() {
  const tokens = loadTokens();
  const basic = Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!res.ok) {
    throw new Error(`Fitbit token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  const next = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || tokens.refresh_token,
  };
  saveTokens(next);
  return next.access_token;
}

/**
 * Call a Fitbit API path with the current access token. On 401, refresh once
 * and retry. Throws an Error tagged with `.status` so callers can map 401 →
 * "Fitbit connection needs refresh."
 */
async function fitbitGet(path) {
  let { access_token } = loadTokens();

  const doFetch = (token) =>
    fetch(`https://api.fitbit.com${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  let res = await doFetch(access_token);
  if (res.status === 401) {
    access_token = await refreshAccessToken();
    res = await doFetch(access_token);
  }

  if (!res.ok) {
    const err = new Error(`Fitbit ${path} failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// ---- intraday cache --------------------------------------------------------
// Keyed by date string. Entries expire after 1 hour.

const intradayCache = new Map();
const ONE_HOUR = 60 * 60 * 1000;

function cacheGet(date) {
  const hit = intradayCache.get(date);
  if (!hit) return null;
  if (Date.now() - hit.at > ONE_HOUR) {
    intradayCache.delete(date);
    return null;
  }
  return hit.data;
}

function cacheSet(date, data) {
  intradayCache.set(date, { at: Date.now(), data });
}

// ---- mock generators -------------------------------------------------------

function mockRestingHr(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const phase = (days - i) / days;
    const wave = Math.sin(phase * Math.PI * 2.4) * 4;
    const drift = Math.sin(phase * Math.PI * 11) * 2;
    out.push({
      date: d.toISOString().slice(0, 10),
      restingHR: Math.round(62 + wave + drift),
    });
  }
  return out;
}

// A caffeine pulse: 0 at the coffee moment, ramps to ~+12 bpm by ~18 min,
// then decays back toward baseline over the next ~40 min.
function caffeinePulse(minutesAfter) {
  if (minutesAfter < 0) return 0;
  if (minutesAfter <= 18) return (12 * minutesAfter) / 18;
  return 12 * Math.exp(-(minutesAfter - 18) / 25);
}

function mockIntraday(date) {
  const out = [];
  for (let minute = 0; minute < 1440; minute++) {
    const hh = String(Math.floor(minute / 60)).padStart(2, "0");
    const mm = String(minute % 60).padStart(2, "0");
    const diurnal = Math.sin((minute / 1440) * Math.PI * 2 - Math.PI / 2) * 3;
    let bump = 0;
    for (const { h, m } of MOCK_COFFEE_HOURS) {
      bump += caffeinePulse(minute - (h * 60 + m));
    }
    out.push({
      time: `${hh}:${mm}:00`,
      value: Math.round(60 + diurnal + bump),
    });
  }
  return out;
}

// ---- routes ----------------------------------------------------------------

// GET /api/hr → [{ date, restingHR }]  (0/null days filtered out)
router.get("/hr", async (_req, res) => {
  if (useMock()) {
    res.set("X-Data-Source", "mock");
    return res.json(mockRestingHr(30));
  }

  try {
    const data = await fitbitGet(
      "/1/user/-/activities/heart/date/today/30d.json"
    );
    const series = (data["activities-heart"] || [])
      .map((row) => ({
        date: row.dateTime,
        restingHR:
          row.value && typeof row.value === "object"
            ? row.value.restingHeartRate ?? null
            : null,
      }))
      .filter((row) => row.restingHR != null && row.restingHR !== 0);
    res.set("X-Data-Source", "fitbit");
    res.json(series);
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ error: "Fitbit token expired" });
    }
    console.error("[/api/hr]", err.message);
    res.status(502).json({ error: "Failed to load heart rate data" });
  }
});

// GET /api/hr-intraday?date=YYYY-MM-DD → [{ time, value }]
router.get("/hr-intraday", async (req, res) => {
  const date = String(req.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "date=YYYY-MM-DD required" });
  }

  const cached = cacheGet(date);
  if (cached) {
    res.set("X-Data-Source", "cache");
    return res.json(cached);
  }

  if (useMock()) {
    const data = mockIntraday(date);
    cacheSet(date, data);
    res.set("X-Data-Source", "mock");
    return res.json(data);
  }

  try {
    const data = await fitbitGet(
      `/1/user/-/activities/heart/date/${date}/1d/1min.json`
    );
    const series = (data["activities-heart-intraday"]?.dataset || []).map(
      (row) => ({ time: row.time, value: row.value })
    );
    cacheSet(date, series);
    res.set("X-Data-Source", "fitbit");
    res.json(series);
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ error: "Fitbit token expired" });
    }
    console.error("[/api/hr-intraday]", err.message);
    res.status(502).json({ error: "Failed to load intraday heart rate" });
  }
});

export default router;
