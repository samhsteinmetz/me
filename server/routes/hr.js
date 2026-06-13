// routes/hr.js — Google Health heart-rate endpoints.
//
//   GET /api/hr            → last 30 days of daily resting heart rate
//   GET /api/hr-intraday   → per-minute heart rate for a single date (?date=)
//
// Data source: Google Health API v4 (health.googleapis.com). All OAuth /
// token-refresh logic lives in ../googleHealth.js and is shared across routes.
//
//   - Resting HR uses the native `daily-resting-heart-rate` data type, which
//     returns one { date, beatsPerMinute } point per day.
//   - Intraday uses the `heart-rate` data type, a SAMPLE type whose points are
//     { sampleTime, beatsPerMinute } (no "interval" — heart rate is sampled).
//
// When Google Health credentials are missing (or MOCK_DATA=true) every endpoint
// returns deterministic mock data so the frontend renders end-to-end in dev.

import { Router } from "express";
import { hasGoogleHealth, listAllDataPoints } from "../googleHealth.js";

const router = Router();

// Coffee bump anchors shared with the mock coffee log so the response-curve
// feature visibly works in mock mode. (clock hours, local time)
const MOCK_COFFEE_HOURS = [{ h: 9, m: 15 }, { h: 14, m: 15 }];

function useMock() {
  return process.env.MOCK_DATA === "true" || !hasGoogleHealth();
}

// ---- date / value helpers --------------------------------------------------

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// Google Health civil dates arrive as { year, month, day }.
function civilDateToYmd(cd) {
  if (!cd || cd.year == null) return null;
  const m = String(cd.month ?? 1).padStart(2, "0");
  const d = String(cd.day ?? 1).padStart(2, "0");
  return `${cd.year}-${m}-${d}`;
}

function toNumber(v) {
  // beatsPerMinute is returned as a string in the Health API.
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

// Extract "HH:MM" from a heart-rate sample's sampleTime. Prefer civil time
// (the wearable's local clock, which matches coffee timestamps); fall back to
// the RFC-3339 physical time.
function sampleClock(sampleTime) {
  const t = sampleTime?.civilTime?.time;
  if (t && t.hours != null) {
    const hh = String(t.hours).padStart(2, "0");
    const mm = String(t.minutes ?? 0).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  const phys = sampleTime?.physicalTime;
  if (typeof phys === "string") {
    const match = phys.match(/T(\d{2}:\d{2})/);
    if (match) return match[1];
  }
  return null;
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

// On a failed upstream call, surface the raw error only when ?debug=1 is set.
function sendError(req, res, err, fallback) {
  if (err.status === 401) {
    return res.status(401).json({ error: "Google Health token expired" });
  }
  const body = { error: fallback };
  if (req.query.debug) body.detail = err.message;
  res.status(err.status || 502).json(body);
}

// GET /api/hr → [{ date, restingHR }]  (0/null days filtered out, sorted asc)
router.get("/hr", async (req, res) => {
  if (useMock()) {
    res.set("X-Data-Source", "mock");
    return res.json(mockRestingHr(30));
  }

  try {
    const start = ymd(daysAgo(30));
    // Daily-summary filter pattern: `{data_type}.date >= "YYYY-MM-DD"`.
    // The data-type token is snake_case (verified against the live API).
    const filter = `daily_resting_heart_rate.date >= "${start}"`;
    const points = await listAllDataPoints("daily-resting-heart-rate", filter);

    // The API can return multiple resting-HR points per day (one per data
    // source/device). Collapse to a single averaged value per date.
    const byDate = new Map();
    for (const dp of points) {
      const rhr = dp.dailyRestingHeartRate || {};
      const date = civilDateToYmd(rhr.date);
      const v = toNumber(rhr.beatsPerMinute);
      if (!date || v == null || v === 0) continue;
      const cur = byDate.get(date) || { sum: 0, count: 0 };
      cur.sum += v;
      cur.count += 1;
      byDate.set(date, cur);
    }
    const series = [...byDate.entries()]
      .map(([date, { sum, count }]) => ({
        date,
        restingHR: Math.round(sum / count),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.set("X-Data-Source", "google-health");
    res.json(series);
  } catch (err) {
    console.error("[/api/hr]", err.message);
    sendError(req, res, err, "Failed to load heart rate data");
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
    const next = ymd(new Date(new Date(`${date}T00:00:00Z`).getTime() + 86400000));
    // Heart rate is a SAMPLE type → filter on sample_time.civil_time. The
    // data-type token is snake_case (verified against the live API).
    const filter =
      `heart_rate.sample_time.civil_time >= "${date}T00:00:00" ` +
      `AND heart_rate.sample_time.civil_time < "${next}T00:00:00"`;
    const points = await listAllDataPoints("heart-rate", filter, 10000);

    // The API returns dense, sub-minute, multi-source samples. Aggregate to a
    // single averaged BPM per "HH:MM" so the chart gets clean per-minute data.
    const byMinute = new Map();
    for (const dp of points) {
      const hr = dp.heartRate || {};
      const time = sampleClock(hr.sampleTime);
      const v = toNumber(hr.beatsPerMinute);
      if (!time || v == null) continue;
      const cur = byMinute.get(time) || { sum: 0, count: 0 };
      cur.sum += v;
      cur.count += 1;
      byMinute.set(time, cur);
    }
    const series = [...byMinute.entries()]
      .map(([time, { sum, count }]) => ({ time, value: Math.round(sum / count) }))
      .sort((a, b) => a.time.localeCompare(b.time));

    cacheSet(date, series);
    res.set("X-Data-Source", "google-health");
    res.json(series);
  } catch (err) {
    console.error("[/api/hr-intraday]", err.message);
    sendError(req, res, err, "Failed to load intraday heart rate");
  }
});

export default router;
