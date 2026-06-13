/**
 * Fitbit Web API integration.
 *
 * Auth model: Personal-app refresh token flow. The user generates a long-lived
 * refresh token once (via the Fitbit OAuth 2.0 tutorial) and stores it as
 * FITBIT_REFRESH_TOKEN. The server exchanges it for a short-lived access
 * token on each call. New refresh tokens that come back are not persisted
 * here — for a real production deployment, you'd want to write them back
 * to env / a secret store. For a personal portfolio that's not critical.
 */

const TOKEN_URL = "https://api.fitbit.com/oauth2/token";

export function hasFitbit() {
  return Boolean(
    process.env.FITBIT_CLIENT_ID &&
      process.env.FITBIT_CLIENT_SECRET &&
      process.env.FITBIT_REFRESH_TOKEN
  );
}

async function getAccessToken() {
  const basicAuth = Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.FITBIT_REFRESH_TOKEN,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Fitbit token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Resting heart rate for the last `days` days.
 * Returns an array of { date: "YYYY-MM-DD", restingHr: number | null }.
 */
export async function fetchRestingHeartRate(days = 30) {
  const token = await getAccessToken();
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  const fmt = (d) => d.toISOString().slice(0, 10);

  const url = `https://api.fitbit.com/1/user/-/activities/heart/date/${fmt(
    start
  )}/${fmt(end)}.json`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Fitbit HR fetch failed: ${res.status}`);
  }

  const data = await res.json();
  const series = data["activities-heart"] || [];

  return series.map((row) => ({
    date: row.dateTime,
    restingHr:
      typeof row.value === "object" && row.value.restingHeartRate != null
        ? row.value.restingHeartRate
        : null,
  }));
}

/**
 * Deterministic mock HR series — same shape as the real endpoint.
 * Used when FITBIT_* env vars aren't set so the frontend still renders.
 */
export function mockRestingHeartRate(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Smooth-ish wave centered around 62 bpm with mild day-to-day drift.
    const phase = (days - i) / days;
    const wave = Math.sin(phase * Math.PI * 2.4) * 4;
    const drift = Math.sin(phase * Math.PI * 11) * 2;
    out.push({
      date: d.toISOString().slice(0, 10),
      restingHr: Math.round(62 + wave + drift),
    });
  }
  return out;
}
