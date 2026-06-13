// StatsSection — plain text stats computed entirely client-side from the
// already-fetched data. No cards, no grid: muted labels, ink values, serif.

import type { CoffeeEntry, HrPoint } from "../../lib/api";
import type { ResponseCurve } from "./analysis";

const INK = "#1A1916";
const MUTED = "#6B6860";

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <p className="font-serif" style={{ fontSize: 13, lineHeight: 2 }}>
      <span style={{ color: MUTED }}>{label}</span>{" "}
      <span style={{ color: INK }}>{value}</span>
      {suffix ? (
        <span className="italic" style={{ color: MUTED }}>
          {" "}
          {suffix}
        </span>
      ) : null}
    </p>
  );
}

export default function StatsSection({
  hrData,
  coffeeData,
  response,
  marketSync,
}: {
  hrData: HrPoint[];
  coffeeData: CoffeeEntry[];
  response: ResponseCurve;
  marketSync: number;
}) {
  // 1. Current resting HR + "above your average" flag.
  const current = hrData.length ? hrData[hrData.length - 1].restingHR : null;
  const avg =
    hrData.length > 0
      ? hrData.reduce((s, h) => s + h.restingHR, 0) / hrData.length
      : null;
  const aboveAvg =
    current != null && avg != null && current > avg + 5
      ? "above your average"
      : undefined;

  // 2. Avg coffee spike = mean of per-entry peak deltas.
  const enoughSpike = response.sampleCount >= 3 && response.peaks.length > 0;
  const avgSpike = enoughSpike
    ? response.peaks.reduce((s, p) => s + p, 0) / response.peaks.length
    : null;

  // 3. Cups in the last 7 days.
  const weekAgo = Date.now() - 7 * 86_400_000;
  const cups = coffeeData.filter(
    (c) => Date.parse(c.timestamp) >= weekAgo
  ).length;

  // 4. Most elevated day (highest resting HR in last 30).
  let peakDay: HrPoint | null = null;
  for (const h of hrData) {
    if (!peakDay || h.restingHR > peakDay.restingHR) peakDay = h;
  }
  const mostElevated = peakDay
    ? new Date(peakDay.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <section aria-labelledby="vp-stats">
      <h3
        id="vp-stats"
        className="font-serif"
        style={{ fontSize: "0.9375rem", color: INK }}
      >
        Stats
      </h3>
      <div className="mt-2">
        <Stat
          label="Resting HR"
          value={current != null ? `${current} bpm` : "—"}
          suffix={aboveAvg}
        />
        <Stat
          label="Avg coffee spike"
          value={
            enoughSpike && avgSpike != null
              ? `+${avgSpike.toFixed(1)} bpm`
              : "not enough data yet"
          }
        />
        <Stat label="This week" value={`${cups} ${cups === 1 ? "cup" : "cups"}`} />
        <Stat label="Most elevated" value={mostElevated} />
        <Stat label="Market sync" value={`${marketSync}/30 days`} />
      </div>
    </section>
  );
}
