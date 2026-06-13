// CoffeeResponseChart — average HR response in the 60 minutes after a coffee.
// Each entry is normalized to its minute-0 baseline (delta), then averaged
// across all entries. Needs >=3 entries with intraday HR to be meaningful.

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { curveSummary, type ResponseCurve } from "./analysis";

const INK = "#1A1916";
const ACCENT = "#C0392B"; // heart-rate response — warm red (matches HR line)
const MUTED = "#6B6860";

const tick = {
  fontSize: 10,
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
  fill: MUTED,
};

export default function CoffeeResponseChart({
  response,
}: {
  response: ResponseCurve;
}) {
  const { curve, sampleCount } = response;

  if (sampleCount < 3) {
    return (
      <p style={{ fontSize: 13, color: MUTED }} className="mt-3 italic">
        Log a few more coffees to see your response curve.
      </p>
    );
  }

  const { peakDelta, peakMinute, backToBaselineMinute } = curveSummary(curve);

  return (
    <div className="mt-3">
      <div style={{ height: 120, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={curve}
            margin={{ top: 24, right: 10, bottom: 2, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              horizontal
              stroke={INK}
              strokeOpacity={0.08}
            />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tick={tick}
              tickLine={false}
              axisLine={false}
              label={{
                value: "minutes after coffee",
                position: "insideBottomRight",
                offset: -2,
                fontSize: 10,
                fill: MUTED,
              }}
            />
            <YAxis
              tick={tick}
              tickLine={false}
              axisLine={false}
              width={34}
              label={{
                value: "+bpm",
                position: "insideTopLeft",
                offset: 8,
                fontSize: 10,
                fill: MUTED,
              }}
            />
            <ReferenceLine y={0} stroke={INK} strokeOpacity={0.2} />
            <Area
              type="monotone"
              dataKey="avgDelta"
              stroke={ACCENT}
              strokeOpacity={0.8}
              strokeWidth={1.5}
              fill={ACCENT}
              fillOpacity={0.1}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={peakMinute}
              y={peakDelta}
              r={3}
              fill={ACCENT}
              stroke="none"
              label={{
                value: `+${peakDelta.toFixed(1)} bpm at ${peakMinute} min`,
                position: "top",
                fontSize: 11,
                fill: MUTED,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p style={{ fontSize: 13, color: MUTED }} className="mt-2 italic">
        Peak response: +{peakDelta.toFixed(1)} bpm at {peakMinute} minutes.
        {backToBaselineMinute != null
          ? ` Back to baseline by ${backToBaselineMinute} minutes.`
          : " Still elevated at 60 minutes."}
      </p>
    </div>
  );
}
