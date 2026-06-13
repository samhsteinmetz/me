// HRVixChart — resting HR (red) vs VIX (black) over the last 30 days.
// Graph-paper styling: horizontal-only grid, no chart background. Lines bridge
// missing days (e.g. VIX over weekends when markets are closed) so they read
// as continuous.

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HrPoint, VixPoint } from "../../lib/api";
import {
  joinHrVix,
  marketSyncCount,
  marketSyncSuffix,
  type MergedPoint,
} from "./analysis";

const INK = "#1A1916";
const HR = "#C0392B"; // heart rate — warm red
const MUTED = "#6B6860";
const PAPER = "#FAFAF8";

const tick = {
  fontSize: 10,
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
  fill: MUTED,
};

function fmtDate(iso: string): string {
  // "2024-05-01" → "May 1"
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface TooltipItem {
  dataKey?: string | number;
  value?: number | string | null;
}

function NotebookTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const hr = payload.find((p) => p.dataKey === "restingHR")?.value;
  const vix = payload.find((p) => p.dataKey === "vix")?.value;
  return (
    <div
      style={{
        background: PAPER,
        border: `1px solid ${INK}`,
        borderRadius: 0,
        boxShadow: "none",
        padding: "4px 8px",
        fontSize: 12,
        color: INK,
        lineHeight: 1.5,
      }}
    >
      <div>{label ? fmtDate(label) : ""}</div>
      {hr != null && <div>HR {hr} bpm</div>}
      {vix != null && <div>VIX {Number(vix).toFixed(1)}</div>}
    </div>
  );
}

export default function HRVixChart({
  hrData,
  vixData,
}: {
  hrData: HrPoint[];
  vixData: VixPoint[];
}) {
  const merged: MergedPoint[] = joinHrVix(hrData, vixData);
  const n = marketSyncCount(merged);

  // Show ~5 evenly spaced date labels.
  const interval =
    merged.length > 5 ? Math.ceil(merged.length / 5) - 1 : 0;

  return (
    <div>
      <div style={{ height: 160, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={merged}
            margin={{ top: 6, right: 4, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              horizontal
              stroke={INK}
              strokeOpacity={0.08}
            />
            <XAxis
              dataKey="date"
              tickFormatter={fmtDate}
              tick={tick}
              interval={interval}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="hr"
              orientation="left"
              domain={["dataMin - 5", "dataMax + 5"]}
              tick={tick}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <YAxis
              yAxisId="vix"
              orientation="right"
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={tick}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              content={<NotebookTooltip />}
              cursor={{ stroke: INK, strokeOpacity: 0.2, strokeWidth: 1 }}
            />
            <Line
              yAxisId="hr"
              type="monotone"
              dataKey="restingHR"
              stroke={HR}
              strokeWidth={1.75}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              yAxisId="vix"
              type="monotone"
              dataKey="vix"
              stroke={INK}
              strokeWidth={1.5}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Inline legend using literal line characters — no colored boxes. */}
      <div
        style={{ fontSize: 11, color: MUTED }}
        className="mt-1 flex items-center gap-4"
      >
        <span>
          <span style={{ color: HR }}>—</span> HR
        </span>
        <span>
          <span style={{ color: INK }}>—</span> VIX
        </span>
      </div>

      <p
        style={{ fontSize: 13, color: MUTED }}
        className="mt-2 italic"
      >
        Me and the market moved together on {n} of the last 30 days.
        {marketSyncSuffix(n)}
      </p>
    </div>
  );
}
