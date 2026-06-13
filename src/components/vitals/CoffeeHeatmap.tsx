// CoffeeHeatmap — a single-month calendar heat map of cups per day.
//
// Shows the month of the most recent logged cup (falls back to the current
// month). Each day is a square whose warm-red intensity scales with the number
// of cups that day; empty days are faint. Read-only; purely derived from the
// coffee log already fetched by the panel.

import type { CoffeeEntry } from "../../lib/api";

const INK = "#1A1916";
const MUTED = "#6B6860";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CoffeeHeatmap({
  coffeeData,
}: {
  coffeeData: CoffeeEntry[];
}) {
  // coffeeData is newest-first, so [0] anchors the month we display.
  const ref = coffeeData.length ? new Date(coffeeData[0].timestamp) : new Date();
  const year = ref.getFullYear();
  const month = ref.getMonth();

  // Cups per calendar day (local time), and the busiest day for scaling.
  const counts = new Array(32).fill(0);
  for (const e of coffeeData) {
    const d = new Date(e.timestamp);
    if (d.getFullYear() === year && d.getMonth() === month) {
      counts[d.getDate()] += 1;
    }
  }
  const max = counts.reduce((m, c) => Math.max(m, c), 0);
  const total = counts.reduce((s, c) => s + c, 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toLowerCase();

  const intensity = (count: number) =>
    max > 0 ? 0.22 + 0.78 * (count / max) : 0;

  const cellBg = (count: number) =>
    count === 0 ? "#ECECE7" : `rgba(192, 57, 43, ${intensity(count).toFixed(2)})`;
  const cellFg = (count: number) =>
    count === 0
      ? "rgba(26,25,22,0.28)"
      : intensity(count) > 0.55
      ? "#FAFAF8"
      : INK;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono" style={{ fontSize: 11, color: MUTED }}>
          {monthLabel}
        </span>
        <span className="font-mono" style={{ fontSize: 11, color: MUTED }}>
          {total} {total === 1 ? "cup" : "cups"}
        </span>
      </div>

      <div
        className="mt-2"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}
      >
        {WEEKDAYS.map((w, i) => (
          <div
            key={`wd-${i}`}
            className="font-mono"
            style={{ fontSize: 9, color: MUTED, textAlign: "center", paddingBottom: 2 }}
          >
            {w}
          </div>
        ))}

        {cells.map((day, i) =>
          day === null ? (
            <div key={`pad-${i}`} aria-hidden="true" />
          ) : (
            <div
              key={`day-${day}`}
              title={`${new Date(year, month, day).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })} — ${counts[day]} ${counts[day] === 1 ? "cup" : "cups"}`}
              className="font-mono"
              style={{
                aspectRatio: "1 / 1",
                background: cellBg(counts[day]),
                color: cellFg(counts[day]),
                border:
                  counts[day] === 0
                    ? "1px solid rgba(26,25,22,0.07)"
                    : "1px solid transparent",
                borderRadius: 2,
                fontSize: 10,
                lineHeight: 1,
                padding: "2px 0 0 3px",
              }}
            >
              {day}
            </div>
          )
        )}
      </div>
    </div>
  );
}
