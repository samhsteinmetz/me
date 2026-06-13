const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface HrPoint {
  date: string;
  restingHr: number | null;
}
export interface VixPoint {
  date: string;
  vix: number | null;
}
export interface CoffeeLog {
  id: number;
  logged_at: string;
  notes: string | null;
}

interface SeriesResponse<T> {
  source: string;
  series: T[];
}

interface CoffeeResponse {
  source: string;
  logs: CoffeeLog[];
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} on ${url}`);
  }
  return res.json();
}

export function fetchHr(days = 30) {
  return getJson<SeriesResponse<HrPoint>>(`${BASE}/api/hr?days=${days}`);
}

export function fetchVix(days = 30) {
  return getJson<SeriesResponse<VixPoint>>(`${BASE}/api/vix?days=${days}`);
}

export function fetchCoffee(days = 30) {
  return getJson<CoffeeResponse>(`${BASE}/api/coffee?days=${days}`);
}

export async function postCoffee(
  idToken: string,
  body: { notes?: string | null; logged_at?: string }
): Promise<{ source: string; log: CoffeeLog }> {
  const res = await fetch(`${BASE}/api/coffee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).error || "";
    } catch {
      // ignore
    }
    throw new Error(`POST /api/coffee failed: ${res.status} ${detail}`);
  }
  return res.json();
}
