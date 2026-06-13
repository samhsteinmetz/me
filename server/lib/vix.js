/**
 * VIX (CBOE volatility index) daily-close series.
 *
 * Uses a RapidAPI Yahoo-Finance-style endpoint. The default RAPIDAPI_HOST
 * is `apidojo-yahoo-finance-v1.p.rapidapi.com`, which exposes
 * `/stock/v3/get-chart` returning OHLC candles. If you subscribe to a
 * different provider, override the host and adjust the path / response
 * parsing below.
 */

export function hasVix() {
  return Boolean(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST);
}

export async function fetchVixSeries(days = 30) {
  const host = process.env.RAPIDAPI_HOST;
  const symbol = "%5EVIX"; // URL-encoded ^VIX

  // Slightly over-fetch (3 months) and slice to the requested window so that
  // weekends / holidays don't leave us short.
  const url = `https://${host}/stock/v3/get-chart?interval=1d&symbol=${symbol}&range=3mo&region=US&includePrePost=false`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": host,
    },
  });

  if (!res.ok) {
    throw new Error(`VIX fetch failed: ${res.status}`);
  }

  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error("VIX response missing chart.result");

  const ts = result.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];

  const series = ts
    .map((t, i) => ({
      date: new Date(t * 1000).toISOString().slice(0, 10),
      vix: typeof closes[i] === "number" ? Number(closes[i].toFixed(2)) : null,
    }))
    .filter((row) => row.vix != null);

  return series.slice(-days);
}

/**
 * Deterministic mock VIX series — same shape as the real endpoint.
 */
export function mockVixSeries(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const phase = (days - i) / days;
    // Mostly 14–20 range with a spike around 70% of the window.
    const base = 16 + Math.sin(phase * Math.PI * 1.8) * 3;
    const spike = phase > 0.65 && phase < 0.78 ? 7 * (1 - Math.abs(phase - 0.71) / 0.07) : 0;
    out.push({
      date: d.toISOString().slice(0, 10),
      vix: Number((base + spike).toFixed(2)),
    });
  }
  return out;
}
