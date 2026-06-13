// routes/sleep.js — Google Health sleep endpoint.
//
//   GET /api/sleep → last ~14 nights of sleep summaries
//                    [{ date, asleepMinutes, inBedMinutes, efficiency,
//                       stages: { deep, rem, light, awake }, bedtime, waketime }]
//
// Data source: Google Health API v4 `sleep` data type (a Session type). Each
// data point carries a `sleep.summary` (minutesAsleep, stagesSummary, …) and a
// `sleep.interval` with civil start/end times. We key each night by its civil
// WAKE date and keep the longest session per date (the main sleep, not naps).
//
// Sleep is paginated at pageSize 25 (the API max for sleep); listAllDataPoints
// follows nextPageToken to the end. Filters use snake_case data-type tokens, the
// same convention verified for the heart-rate routes.
//
// When Google Health credentials are missing (or MOCK_DATA=true) this returns
// deterministic mock data so the panel renders end-to-end in dev.

import { Router } from "express";
import { hasGoogleHealth, listAllDataPoints } from "../googleHealth.js";

const router = Router();

const DAYS = 14;

function useMock() {
  return process.env.MOCK_DATA === "true" || !hasGoogleHealth();
}

// ---- helpers ---------------------------------------------------------------

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// Durations come back as strings ("452" or "452.0"); coerce to a number.
function toMinutes(v) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : 0;
}

// CivilDateTime → "YYYY-MM-DD" (its .date is { year, month, day }).
function civilToYmd(cd) {
  const d = cd?.date;
  if (!d || d.year == null) return null;
  const m = String(d.month ?? 1).padStart(2, "0");
  const day = String(d.day ?? 1).padStart(2, "0");
  return `${d.year}-${m}-${day}`;
}

// CivilDateTime → "HH:MM" (its .time is { hours, minutes }).
function civilToClock(cd) {
  const t = cd?.time;
  if (!t || t.hours == null) return null;
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes ?? 0).padStart(2, "0")}`;
}

// Fallback clock from an RFC-3339 instant + UTC offset string ("-14400s").
function clockFromInstant(iso, offset) {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  const offSec = typeof offset === "string" ? parseFloat(offset) : 0;
  const local = new Date(ms + (Number.isFinite(offSec) ? offSec : 0) * 1000);
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Map the API's stage enum into our four display buckets.
function bucketForStage(type) {
  switch (type) {
    case "DEEP":
      return "deep";
    case "REM":
      return "rem";
    case "LIGHT":
    case "ASLEEP": // classic sleep has no fine stages — treat as light/asleep
      return "light";
    case "AWAKE":
    case "RESTLESS":
      return "awake";
    default:
      return null;
  }
}

// Reduce one Sleep data point to our normalized night shape.
function normalizeNight(sleep) {
  const interval = sleep.interval || {};
  const summary = sleep.summary || {};

  const date =
    civilToYmd(interval.civilEndTime) ||
    (interval.endTime ? interval.endTime.slice(0, 10) : null);
  if (!date) return null;

  const stages = { deep: 0, rem: 0, light: 0, awake: 0 };
  for (const s of summary.stagesSummary || []) {
    const bucket = bucketForStage(s.type);
    if (bucket) stages[bucket] += toMinutes(s.minutes);
  }

  const stageAsleep = stages.deep + stages.rem + stages.light;
  const asleepMinutes = toMinutes(summary.minutesAsleep) || stageAsleep;
  const inBedMinutes =
    toMinutes(summary.minutesInSleepPeriod) || asleepMinutes + stages.awake;
  const efficiency =
    inBedMinutes > 0 ? Math.round((asleepMinutes / inBedMinutes) * 100) : null;

  const bedtime =
    civilToClock(interval.civilStartTime) ||
    clockFromInstant(interval.startTime, interval.startUtcOffset);
  const waketime =
    civilToClock(interval.civilEndTime) ||
    clockFromInstant(interval.endTime, interval.endUtcOffset);

  return { date, asleepMinutes, inBedMinutes, efficiency, stages, bedtime, waketime };
}

// ---- mock generator --------------------------------------------------------

function mockSleep(days = DAYS) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const phase = (days - i) / days;
    // Total asleep wobbles around ~7h10m.
    const asleep = Math.round(430 + Math.sin(phase * Math.PI * 2.3) * 35 +
      Math.sin(phase * Math.PI * 9) * 12);
    const deep = Math.round(asleep * 0.18);
    const rem = Math.round(asleep * 0.22);
    const light = asleep - deep - rem;
    const awake = Math.round(20 + Math.sin(phase * Math.PI * 5) * 8);
    const inBed = asleep + awake;
    // Bedtime ~23:1x, wake ~6:5x.
    const bedMin = 23 * 60 + 5 + Math.round(Math.sin(phase * Math.PI * 4) * 25);
    const wakeMin = (bedMin + inBed) % (24 * 60);
    const fmt = (m) =>
      `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    out.push({
      date: d.toISOString().slice(0, 10),
      asleepMinutes: asleep,
      inBedMinutes: inBed,
      efficiency: Math.round((asleep / inBed) * 100),
      stages: { deep, rem, light, awake },
      bedtime: fmt(bedMin),
      waketime: fmt(wakeMin),
    });
  }
  return out;
}

// ---- route -----------------------------------------------------------------

function sendError(req, res, err, fallback) {
  if (err.status === 401) {
    return res.status(401).json({ error: "Google Health token expired" });
  }
  const body = { error: fallback };
  if (req.query.debug) body.detail = err.message;
  res.status(err.status || 502).json(body);
}

// GET /api/sleep → [{ date, asleepMinutes, ... }] (oldest first)
router.get("/sleep", async (req, res) => {
  if (useMock()) {
    res.set("X-Data-Source", "mock");
    return res.json(mockSleep(DAYS));
  }

  try {
    const start = ymd(daysAgo(DAYS));
    // Sessions are filtered by their civil end (wake) time. snake_case token.
    const filter = `sleep.interval.civil_end_time >= "${start}T00:00:00"`;
    const points = await listAllDataPoints("sleep", filter, 25);

    // Keep the longest (most-asleep) session per wake date — drops naps.
    const byDate = new Map();
    for (const dp of points) {
      const night = normalizeNight(dp.sleep || {});
      if (!night) continue;
      const cur = byDate.get(night.date);
      if (!cur || night.asleepMinutes > cur.asleepMinutes) {
        byDate.set(night.date, night);
      }
    }

    const series = [...byDate.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.set("X-Data-Source", "google-health");
    res.json(series);
  } catch (err) {
    console.error("[/api/sleep]", err.message);
    sendError(req, res, err, "Failed to load sleep data");
  }
});

export default router;
