// googleHealth.js — shared Google Health API client.
//
// Single source of OAuth token handling for every route. Holds the access /
// refresh tokens (seeded from env), refreshes the access token on any 401 and
// retries the request once, and exposes helpers for the data-point list
// endpoint (with pagination), identity, and the one-time auth-code exchange.
//
// Docs: https://developers.google.com/health/reference/rest  (service:
// health.googleapis.com). Never hardcode secrets — everything comes from env.

const API_BASE = "https://health.googleapis.com/v4";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Read-only scopes for the data we use (heart rate, daily resting HR, sleep).
export const GOOGLE_HEALTH_SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
];

// In-memory token state, seeded from env. The refresh token is the durable
// credential; the access token is short-lived and refreshed as needed. (On a
// restart we fall back to the env values, which is fine for a personal app.)
let accessToken = process.env.GOOGLE_HEALTH_ACCESS_TOKEN || null;
let refreshToken = process.env.GOOGLE_HEALTH_REFRESH_TOKEN || null;

/** @returns {boolean} whether Google Health credentials are configured. */
export function hasGoogleHealth() {
  return Boolean(
    process.env.GOOGLE_HEALTH_CLIENT_ID &&
      process.env.GOOGLE_HEALTH_CLIENT_SECRET &&
      (refreshToken || accessToken)
  );
}

/** The redirect URI registered in Google Cloud Console. Env-driven; falls back
 *  to building it from the incoming request when not set. */
export function redirectUri(req) {
  if (process.env.GOOGLE_HEALTH_REDIRECT_URI) {
    return process.env.GOOGLE_HEALTH_REDIRECT_URI;
  }
  // Render terminates TLS, so trust x-forwarded-proto when present.
  const proto = req?.headers["x-forwarded-proto"] || req?.protocol || "https";
  const host = req?.headers.host;
  return `${proto}://${host}/auth/google/callback`;
}

/** Build the Google OAuth consent URL for the one-time authorization. */
export function consentUrl(uri) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
    redirect_uri: uri,
    response_type: "code",
    scope: GOOGLE_HEALTH_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

async function refreshAccessToken() {
  if (!refreshToken) throw new Error("No Google Health refresh token configured.");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_HEALTH_CLIENT_SECRET || "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${res.status}`);
  }
  const data = await res.json();
  accessToken = data.access_token;
  return accessToken;
}

/**
 * Exchange a one-time authorization code for tokens (used by the OAuth
 * callback). Stores both tokens in memory and returns the raw response so the
 * caller can show them for copying into Render env vars.
 */
export async function exchangeCodeForTokens(code, uri) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_HEALTH_CLIENT_SECRET || "",
      redirect_uri: uri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Code exchange failed: ${res.status} ${detail}`);
  }
  const data = await res.json();
  if (data.access_token) accessToken = data.access_token;
  if (data.refresh_token) refreshToken = data.refresh_token;
  return data;
}

/**
 * GET a Google Health API path with bearer auth. On 401, refresh once and
 * retry. Throws an Error tagged with `.status` so routes can special-case 401.
 * @param {string} path API path beginning with "/" (relative to /v4)
 */
export async function ghGet(path) {
  if (!accessToken) await refreshAccessToken();

  const doFetch = (token) =>
    fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

  let res = await doFetch(accessToken);
  if (res.status === 401) {
    await refreshAccessToken();
    res = await doFetch(accessToken);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(`Google Health GET ${path} -> ${res.status} ${detail}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** GET the authenticated user's identity (legacy + Google health user id). */
export function getIdentity() {
  return ghGet("/users/me/identity");
}

/**
 * List ALL data points for a data type, following nextPageToken to the end.
 * @param {string} dataTypeKebab e.g. "heart-rate", "daily-resting-heart-rate"
 * @param {string} [filter] AIP-160 filter expression (will be URL-encoded)
 * @param {number} [pageSize]
 * @returns {Promise<object[]>} all DataPoint objects across pages
 */
export async function listAllDataPoints(dataTypeKebab, filter, pageSize) {
  const out = [];
  let pageToken = null;
  do {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    if (pageSize) params.set("pageSize", String(pageSize));
    if (pageToken) params.set("pageToken", pageToken);
    const data = await ghGet(
      `/users/me/dataTypes/${dataTypeKebab}/dataPoints?${params.toString()}`
    );
    if (Array.isArray(data.dataPoints)) out.push(...data.dataPoints);
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return out;
}
