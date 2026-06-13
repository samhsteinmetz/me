// SleepSection — sleep statistics pulled from the Google Health `sleep` data
// type (via /api/sleep). Shows last night's duration + a stacked stage bar,
// plus 7-night averages. Plain-text, notebook style to match StatsSection.

import type { SleepNight } from "../../lib/api";

const INK = "#1A1916";
const MUTED = "#6B6860";

// Cool palette for sleep; awake reuses the warm accent so it pops as "not asleep".
const STAGES = [
  { key: "deep", label: "deep", color: "#2C3E5A" },
  { key: "rem", label: "rem", color: "#3F5A82" },
  { key: "light", label: "light", color: "#9DB0CB" },
  { key: "awake", label: "awake", color: "#C0392B" },
] as const;

function fmtDur(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function clockToMin(hhmm: string | null): number | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

// Average a list of clock-minutes. Bedtimes that cross midnight (e.g. 00:30)
// are shifted +24h before averaging so they don't drag the mean to noon.
function avgClock(mins: number[], wrapEarly: boolean): string | null {
  if (!mins.length) return null;
  const adj = mins.map((v) => (wrapEarly && v < 12 * 60 ? v + 24 * 60 : v));
  const avg = Math.round(adj.reduce((s, v) => s + v, 0) / adj.length) % (24 * 60);
  return fmtClockLabel(avg);
}

function fmtClockLabel(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <p className="font-serif" style={{ fontSize: 13, lineHeight: 2 }}>
      <span style={{ color: MUTED }}>{label}</span>{" "}
      <span style={{ color: INK }}>{value}</span>
    </p>
  );
}

export default function SleepSection({
  sleepData,
  sleepError,
  sleepAuthError,
}: {
  sleepData: SleepNight[];
  sleepError: string | null;
  sleepAuthError: boolean;
}) {
  const heading = (
    <h3
      id="vp-sleep"
      className="font-serif"
      style={{ fontSize: "0.9375rem", color: INK }}
    >
      Sleep
    </h3>
  );

  if (sleepAuthError) {
    return (
      <section aria-labelledby="vp-sleep">
        {heading}
        <p style={{ fontSize: 12, color: MUTED }} className="mt-2 italic">
          Health connection needs refresh.
        </p>
      </section>
    );
  }

  if (sleepError || sleepData.length === 0) {
    return (
      <section aria-labelledby="vp-sleep">
        {heading}
        <p style={{ fontSize: 12, color: MUTED }} className="mt-2 italic">
          {sleepError ? "Couldn\u2019t load sleep data." : "No sleep data yet."}
        </p>
      </section>
    );
  }

  const last = sleepData[sleepData.length - 1];
  const recent = sleepData.slice(-7);

  const avgAsleep =
    recent.reduce((s, n) => s + n.asleepMinutes, 0) / recent.length;

  const bedMins = recent
    .map((n) => clockToMin(n.bedtime))
    .filter((v): v is number => v != null);
  const wakeMins = recent
    .map((n) => clockToMin(n.waketime))
    .filter((v): v is number => v != null);
  const avgBed = avgClock(bedMins, true);
  const avgWake = avgClock(wakeMins, false);

  const lastDate = new Date(last.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Stage bar uses the full in-bed total so awake time is visible.
  const stageTotal =
    last.stages.deep + last.stages.rem + last.stages.light + last.stages.awake ||
    1;

  return (
    <section aria-labelledby="vp-sleep">
      {heading}

      <p className="mt-2 font-serif" style={{ fontSize: 13, lineHeight: 1.8 }}>
        <span style={{ color: MUTED }}>Last night</span>{" "}
        <span style={{ color: INK }}>{fmtDur(last.asleepMinutes)} asleep</span>
        <span className="italic" style={{ color: MUTED }}>
          {" "}
          · {lastDate}
          {last.efficiency != null ? ` · ${last.efficiency}% efficiency` : ""}
        </span>
      </p>

      {/* Stacked stage bar for last night. */}
      <div
        className="mt-2"
        style={{
          display: "flex",
          width: "100%",
          height: 10,
          borderRadius: 2,
          overflow: "hidden",
        }}
        role="img"
        aria-label={`Sleep stages: ${STAGES.map(
          (s) => `${s.label} ${last.stages[s.key]} minutes`
        ).join(", ")}`}
      >
        {STAGES.map((s) => {
          const mins = last.stages[s.key];
          if (mins <= 0) return null;
          return (
            <div
              key={s.key}
              title={`${s.label}: ${fmtDur(mins)}`}
              style={{ width: `${(mins / stageTotal) * 100}%`, background: s.color }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap" style={{ gap: "4px 12px" }}>
        {STAGES.map((s) => (
          <span
            key={s.key}
            className="font-mono"
            style={{ fontSize: 10, color: MUTED, display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: 1, background: s.color, display: "inline-block" }}
            />
            {s.label} {fmtDur(last.stages[s.key])}
          </span>
        ))}
      </div>

      <div className="mt-3">
        <Stat label="7-night avg" value={fmtDur(avgAsleep)} />
        <Stat label="Avg bedtime" value={avgBed ?? "\u2014"} />
        <Stat label="Avg wake" value={avgWake ?? "\u2014"} />
      </div>
    </section>
  );
}
