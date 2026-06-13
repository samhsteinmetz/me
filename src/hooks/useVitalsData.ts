// useVitalsData — single source of truth for all panel data.
//
// On mount it fetches /api/hr, /api/vix, /api/coffee in parallel. Once coffee
// entries are known, it fetches per-minute intraday HR for each unique date
// that has a coffee entry (in parallel, cached by date so a day is never
// refetched). Exposes per-section errors so one failed endpoint never blanks
// the whole panel (see 2G), plus a combined `error` for convenience.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  fetchCoffee,
  fetchHr,
  fetchIntraday,
  fetchVix,
  type CoffeeEntry,
  type HrPoint,
  type IntradayPoint,
  type VixPoint,
} from "../lib/api";

/** Local calendar date ("YYYY-MM-DD") for an ISO timestamp. Intraday HR is
 *  keyed by the day in the viewer's local clock, matching how the response
 *  curve lines up coffee times against per-minute HR. */
export function localDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface VitalsData {
  hrData: HrPoint[];
  vixData: VixPoint[];
  coffeeData: CoffeeEntry[];
  intradayByDate: Record<string, IntradayPoint[]>;
  loading: boolean;
  error: string | null;
  hrError: string | null;
  /** True when /api/hr returned 401 — Google Health token needs a refresh. */
  hrAuthError: boolean;
  vixError: string | null;
  coffeeError: string | null;
  refetch: () => void;
}

export function useVitalsData(): VitalsData {
  const [hrData, setHrData] = useState<HrPoint[]>([]);
  const [vixData, setVixData] = useState<VixPoint[]>([]);
  const [coffeeData, setCoffeeData] = useState<CoffeeEntry[]>([]);
  const [intradayByDate, setIntradayByDate] = useState<
    Record<string, IntradayPoint[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [hrError, setHrError] = useState<string | null>(null);
  const [hrAuthError, setHrAuthError] = useState(false);
  const [vixError, setVixError] = useState<string | null>(null);
  const [coffeeError, setCoffeeError] = useState<string | null>(null);

  // Persistent cache of intraday HR keyed by date — survives refetches.
  const intradayCache = useRef<Map<string, IntradayPoint[]>>(new Map());
  // Guards against out-of-order results when refetch() is called rapidly.
  const runId = useRef(0);

  const loadIntraday = useCallback(
    async (entries: CoffeeEntry[], myRun: number) => {
      const dates = Array.from(
        new Set(entries.map((e) => localDateKey(e.timestamp)))
      );
      const missing = dates.filter((d) => !intradayCache.current.has(d));

      const fetched = await Promise.all(
        missing.map(async (d) => {
          try {
            return [d, await fetchIntraday(d)] as const;
          } catch {
            // A single bad day shouldn't sink the curve; treat as empty.
            return [d, [] as IntradayPoint[]] as const;
          }
        })
      );
      for (const [d, data] of fetched) intradayCache.current.set(d, data);

      if (runId.current !== myRun) return;
      const next: Record<string, IntradayPoint[]> = {};
      for (const d of dates) next[d] = intradayCache.current.get(d) || [];
      setIntradayByDate(next);
    },
    []
  );

  const load = useCallback(async () => {
    const myRun = ++runId.current;
    setLoading(true);
    setHrError(null);
    setVixError(null);
    setCoffeeError(null);
    setHrAuthError(false);

    // All three in parallel; allSettled so one failure doesn't reject the rest.
    const [hrRes, vixRes, coffeeRes] = await Promise.allSettled([
      fetchHr(),
      fetchVix(),
      fetchCoffee(),
    ]);

    if (runId.current !== myRun) return;

    if (hrRes.status === "fulfilled") {
      setHrData(hrRes.value);
    } else {
      const e = hrRes.reason;
      if (e instanceof ApiError && e.status === 401) setHrAuthError(true);
      setHrError(e?.message || "Failed to load heart rate data.");
    }

    if (vixRes.status === "fulfilled") setVixData(vixRes.value);
    else setVixError(vixRes.reason?.message || "Failed to load VIX data.");

    let coffee: CoffeeEntry[] = [];
    if (coffeeRes.status === "fulfilled") {
      coffee = coffeeRes.value;
      setCoffeeData(coffee);
    } else {
      setCoffeeError(coffeeRes.reason?.message || "Failed to load coffee log.");
    }

    // loading reflects the three primary endpoints; intraday loads after.
    setLoading(false);

    if (coffee.length) void loadIntraday(coffee, myRun);
  }, [loadIntraday]);

  useEffect(() => {
    void load();
  }, [load]);

  const error = hrError || vixError || coffeeError;

  return {
    hrData,
    vixData,
    coffeeData,
    intradayByDate,
    loading,
    error,
    hrError,
    hrAuthError,
    vixError,
    coffeeError,
    refetch: load,
  };
}
