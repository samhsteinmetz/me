// analysis.ts — pure data transforms shared by the vitals components.
// Kept framework-free and side-effect-free so the same correlation number /
// response curve can be reused by the chart and the stats section.

import type {
  CoffeeEntry,
  HrPoint,
  IntradayPoint,
  VixPoint,
} from "../../lib/api";

export interface MergedPoint {
  date: string;
  restingHR: number | null;
  vix: number | null;
}

/**
 * Join HR and VIX series on `date`. Days present in one series but not the
 * other get `null` for the missing metric (weekends have no VIX; missed wearable
 * syncs have no HR) so Recharts can render them as gaps with connectNulls={false}.
 */
export function joinHrVix(hr: HrPoint[], vix: VixPoint[]): MergedPoint[] {
  const byDate = new Map<string, MergedPoint>();
  for (const h of hr) {
    byDate.set(h.date, { date: h.date, restingHR: h.restingHR, vix: null });
  }
  for (const v of vix) {
    const existing = byDate.get(v.date);
    if (existing) existing.vix = v.vix;
    else byDate.set(v.date, { date: v.date, restingHR: null, vix: v.vix });
  }
  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

/**
 * Count days in the (last 30) where resting HR and VIX moved in the same
 * direction (both up or both down) versus the previous day with data.
 */
export function marketSyncCount(merged: MergedPoint[]): number {
  const last30 = merged.slice(-30);
  let count = 0;
  let prevHR: number | null = null;
  let prevVix: number | null = null;
  for (const point of last30) {
    if (point.restingHR == null || point.vix == null) continue;
    if (prevHR != null && prevVix != null) {
      const hrDir = Math.sign(point.restingHR - prevHR);
      const vixDir = Math.sign(point.vix - prevVix);
      if (hrDir !== 0 && hrDir === vixDir) count += 1;
    }
    prevHR = point.restingHR;
    prevVix = point.vix;
  }
  return count;
}

/** Suffix appended to the correlation sentence per the brief's thresholds. */
export function marketSyncSuffix(n: number): string {
  if (n > 20) return " Stressed in sync.";
  if (n < 10) return " right now not much of a correlation";
  return "";
}

// ---- coffee response curve -------------------------------------------------

export interface ResponsePoint {
  minute: number;
  avgDelta: number;
}

export interface ResponseCurve {
  curve: ResponsePoint[];
  /** Number of coffee entries that had usable intraday HR (with a minute-0 baseline). */
  sampleCount: number;
  /** Per-entry peak deltas — used by StatsSection for "avg coffee spike". */
  peaks: number[];
}

function minuteOfDayLocal(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function parseClockMinute(time: string): number {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m);
}

/**
 * Average HR response to coffee. For each entry, take the 60 minutes of
 * intraday HR following the coffee time, subtract the minute-0 value (baseline),
 * then average those deltas across all entries at each minute offset 0..60.
 */
export function computeResponseCurve(
  coffee: CoffeeEntry[],
  intradayByDate: Record<string, IntradayPoint[]>
): ResponseCurve {
  const sums = new Array(61).fill(0);
  const counts = new Array(61).fill(0);
  const peaks: number[] = [];
  let sampleCount = 0;

  for (const entry of coffee) {
    const dateKey = localDateForIso(entry.timestamp);
    const intraday = intradayByDate[dateKey];
    if (!intraday || intraday.length === 0) continue;

    const byMinute = new Map<number, number>();
    for (const point of intraday) {
      byMinute.set(parseClockMinute(point.time), point.value);
    }

    const startMinute = minuteOfDayLocal(entry.timestamp);
    const baseline = byMinute.get(startMinute);
    if (baseline == null) continue; // need a minute-0 anchor to normalize

    let entryPeak = 0;
    let contributed = false;
    for (let offset = 0; offset <= 60; offset++) {
      const v = byMinute.get(startMinute + offset);
      if (v == null) continue;
      const delta = v - baseline;
      sums[offset] += delta;
      counts[offset] += 1;
      if (delta > entryPeak) entryPeak = delta;
      contributed = true;
    }
    if (contributed) {
      peaks.push(entryPeak);
      sampleCount += 1;
    }
  }

  const curve: ResponsePoint[] = [];
  for (let minute = 0; minute <= 60; minute++) {
    if (counts[minute] === 0) continue;
    curve.push({
      minute,
      avgDelta: Number((sums[minute] / counts[minute]).toFixed(2)),
    });
  }

  return { curve, sampleCount, peaks };
}

function localDateForIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Peak point of a response curve plus the minute it returns below +1.0 bpm. */
export function curveSummary(curve: ResponsePoint[]): {
  peakDelta: number;
  peakMinute: number;
  backToBaselineMinute: number | null;
} {
  let peakDelta = 0;
  let peakMinute = 0;
  for (const p of curve) {
    if (p.avgDelta > peakDelta) {
      peakDelta = p.avgDelta;
      peakMinute = p.minute;
    }
  }
  let backToBaselineMinute: number | null = null;
  for (const p of curve) {
    if (p.minute > peakMinute && p.avgDelta < 1.0) {
      backToBaselineMinute = p.minute;
      break;
    }
  }
  return { peakDelta, peakMinute, backToBaselineMinute };
}
