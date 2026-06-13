// routes/vix.js — VIX (CBOE volatility index) daily closes.
//
//   GET /api/vix → [{ date, vix }]  (last ~30 calendar days, ascending)
//
// Fetches Yahoo Finance's public chart JSON directly (no API key, no SDK —
// the yahoo-finance2 package's API is unstable across versions). Falls back to
// deterministic mock data if the upstream call fails or MOCK_DATA=true, so the
// frontend always has something to render.

import { Router } from "express";

const router = Router();

const VIX_URL =
  "https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?range=1mo&interval=1d";

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

router.get("/", async (req, res) => {
  if (process.env.MOCK_DATA === "true") {
    res.set("X-Data-Source", "mock");
    return res.json(mockVix(30));
  }

  try {
    const upstream = await fetch(VIX_URL, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });
    if (!upstream.ok) throw new Error(`Yahoo chart -> ${upstream.status}`);

    const json = await upstream.json();
    const result = json?.chart?.result?.[0];
    const timestamps = result?.timestamp || [];
    const closes = result?.indicators?.quote?.[0]?.close || [];

    const series = timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        vix: closes[i] != null ? Number(Number(closes[i]).toFixed(2)) : null,
      }))
      .filter((r) => r.vix != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!series.length) throw new Error("Yahoo chart returned no closes");

    res.set("X-Data-Source", "yahoo");
    res.json(series);
  } catch (err) {
    console.error("[/api/vix] falling back to mock:", err.message);
    if (req.query.debug) {
      return res.status(502).json({ error: "vix fetch failed", detail: err.message });
    }
    res.set("X-Data-Source", "mock-fallback");
    res.json(mockVix(30));
  }
});

export default router;
