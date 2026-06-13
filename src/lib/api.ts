// api.ts — typed fetch helpers for the vitals backend.
//
// Base URL comes from VITE_API_URL (the Vite-native equivalent of the brief's
// REACT_APP_API_URL — Vite only exposes vars prefixed VITE_ via import.meta.env).
// No API keys ever live here; the frontend only knows the backend URL.

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface HrPoint {
  date: string; // "YYYY-MM-DD"
  restingHR: number;
}
export interface VixPoint {
  date: string; // "YYYY-MM-DD"
  vix: number;
}
export interface CoffeeEntry {
  id: number;
  timestamp: string; // ISO
  notes: string | null;
}
export interface IntradayPoint {
  time: string; // "HH:MM:SS"
  value: number;
}

/** Error carrying the HTTP status so callers can special-case 401 (Fitbit). */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "omit" });
  if (!res.ok) {
    throw new ApiError(`${res.status} ${res.statusText}`, res.status);
  }
  return res.json() as Promise<T>;
}

export const fetchHr = () => getJson<HrPoint[]>("/api/hr");
export const fetchVix = () => getJson<VixPoint[]>("/api/vix");
export const fetchCoffee = () => getJson<CoffeeEntry[]>("/api/coffee");
export const fetchIntraday = (date: string) =>
  getJson<IntradayPoint[]>(`/api/hr-intraday?date=${encodeURIComponent(date)}`);

export async function postCoffee(
  idToken: string,
  body: { timestamp: string; notes: string | null }
): Promise<{ success: boolean; entry: CoffeeEntry }> {
  const res = await fetch(`${API_BASE}/api/coffee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new ApiError(`POST /api/coffee failed: ${res.status}`, res.status);
  }
  return res.json();
}
