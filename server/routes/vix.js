// routes/vix.js — VIX (CBOE volatility index) daily closes.
//
//   GET /api/vix → [{ date, vix }]  (last ~30 calendar days, ascending)
//
// Uses the yahoo-finance2 package (no API key required). Falls back to
// deterministic mock data if the upstream call fails or MOCK_DATA=true, so
// the frontend always has something to render.

import { Router } from "express";
import yahooFinance from "yahoo-finance2";

const router = Router();

function mockVix(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Skip weekends — VIX only trades on market days (mirrors real gaps).
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const phase = (days - i) / days;
    const base = 16 + Math.sin(phase * Math.PI * 1.8) * 3;
    const spike =
      phase > 0.65 && phase < 0.78
        ? 7 * (1 - Math.abs(phase - 0.71) / 0.07)
        : 0;
    out.push({
      date: d.toISOString().slice(0, 10),
      vix: Number((base + spike).toFixed(2)),
    });
  }
  return out;
}

router.get("/", async (_req, res) => {
  if (process.env.MOCK_DATA === "true") {
    res.set("X-Data-Source", "mock");
    return res.json(mockVix(30));
  }

  try {
    const period1 = new Date();
    period1.setDate(period1.getDate() - 30);

    const rows = await yahooFinance.historical("^VIX", {
      period1,
      interval: "1d",
    });

    const series = rows
      .map((r) => ({
        date: new Date(r.date).toISOString().slice(0, 10),
        vix: r.close != null ? Number(Number(r.close).toFixed(2)) : null,
      }))
      .filter((r) => r.vix != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    res.set("X-Data-Source", "yahoo");
    res.json(series);
  } catch (err) {
    console.error("[/api/vix] falling back to mock:", err.message);
    res.set("X-Data-Source", "mock-fallback");
    res.json(mockVix(30));
  }
});

export default router;
