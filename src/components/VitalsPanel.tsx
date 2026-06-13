import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchCoffee,
  fetchHr,
  fetchVix,
  postCoffee,
  type CoffeeLog,
  type HrPoint,
  type VixPoint,
} from "../lib/api";
import { useAuth } from "../lib/auth";
import { signInWithGoogle, signOutCurrentUser } from "../lib/firebase";

interface MergedPoint {
  date: string;
  restingHr: number | null;
  vix: number | null;
  hasCoffee: boolean;
}

// Format an ISO date string ("2026-06-13") as "Jun 13"
function shortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function relativeDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const that = new Date(d);
  that.setHours(0, 0, 0, 0);
  const days = Math.round((+today - +that) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return shortDate(that.toISOString().slice(0, 10));
}

function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Custom dot renderer: only show a dot on days with a coffee log.
type DotPayload = {
  cx?: number;
  cy?: number;
  payload?: MergedPoint;
  index?: number;
};

const CoffeeDot = (props: DotPayload) => {
  if (!props.payload?.hasCoffee || props.cx == null || props.cy == null) {
    return <g key={`empty-${props.index}`} />;
  }
  return (
    <g key={`dot-${props.index}`}>
      <circle
        cx={props.cx}
        cy={props.cy}
        r={3.5}
        fill="#1B1F26"
        stroke="#FAFAF8"
        strokeWidth={1.5}
      />
    </g>
  );
};

interface NotebookTooltipPayloadItem {
  dataKey?: string | number;
  value?: number | string | null;
}
const NotebookTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: NotebookTooltipPayloadItem[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const hr = payload.find((p) => p.dataKey === "restingHr")?.value;
  const vix = payload.find((p) => p.dataKey === "vix")?.value;
  return (
    <div className="bg-paper border border-rule px-2 py-1.5 text-mono font-mono text-ink-soft leading-snug">
      <div className="text-ink">{label ? shortDate(label) : ""}</div>
      {hr != null && <div>hr {hr} bpm</div>}
      {vix != null && <div>vix {Number(vix).toFixed(1)}</div>}
    </div>
  );
};

const VitalsPanel = () => {
  const [open, setOpen] = useState(false);
  const [hr, setHr] = useState<HrPoint[]>([]);
  const [vix, setVix] = useState<VixPoint[]>([]);
  const [coffee, setCoffee] = useState<CoffeeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const { user, configured: authConfigured, getIdToken } = useAuth();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Load once on first open.
  useEffect(() => {
    if (!open || loaded || loading) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchHr(30), fetchVix(30), fetchCoffee(30)])
      .then(([hrRes, vixRes, coffeeRes]) => {
        setHr(hrRes.series);
        setVix(vixRes.series);
        setCoffee(coffeeRes.logs);
        setLoaded(true);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [open, loaded, loading]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const merged: MergedPoint[] = useMemo(() => {
    const byDate = new Map<string, MergedPoint>();
    for (const h of hr) {
      byDate.set(h.date, {
        date: h.date,
        restingHr: h.restingHr,
        vix: null,
        hasCoffee: false,
      });
    }
    for (const v of vix) {
      const existing = byDate.get(v.date);
      if (existing) existing.vix = v.vix;
      else
        byDate.set(v.date, {
          date: v.date,
          restingHr: null,
          vix: v.vix,
          hasCoffee: false,
        });
    }
    const coffeeDates = new Set(
      coffee.map((c) => new Date(c.logged_at).toISOString().slice(0, 10))
    );
    for (const date of coffeeDates) {
      const existing = byDate.get(date);
      if (existing) existing.hasCoffee = true;
    }
    return Array.from(byDate.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [hr, vix, coffee]);

  // Correlation: count days where HR and VIX moved the same direction vs prior.
  const agreeDays = useMemo(() => {
    let agree = 0;
    let pairs = 0;
    for (let i = 1; i < merged.length; i++) {
      const a = merged[i - 1];
      const b = merged[i];
      if (
        a.restingHr == null ||
        b.restingHr == null ||
        a.vix == null ||
        b.vix == null
      )
        continue;
      const hrDir = Math.sign(b.restingHr - a.restingHr);
      const vixDir = Math.sign(b.vix - a.vix);
      if (hrDir === 0 || vixDir === 0) continue;
      pairs += 1;
      if (hrDir === vixDir) agree += 1;
    }
    return { agree, pairs };
  }, [merged]);

  const cupsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86_400_000;
    return coffee.filter((c) => +new Date(c.logged_at) >= weekAgo).length;
  }, [coffee]);

  const mostVolatileDay = useMemo(() => {
    let best: VixPoint | null = null;
    for (const v of vix) {
      if (v.vix == null) continue;
      if (!best || (best.vix != null && v.vix > best.vix)) best = v;
    }
    return best ? shortDate(best.date) : "—";
  }, [vix]);

  const currentHr = useMemo(() => {
    for (let i = hr.length - 1; i >= 0; i--) {
      if (hr[i].restingHr != null) return hr[i].restingHr;
    }
    return null;
  }, [hr]);

  // Daily resting HR is too coarse to compute a real per-coffee spike,
  // so this compares average resting HR on days with ≥1 coffee log vs days
  // without. Honest approximation; intraday HR data would be needed for
  // the literal "+X bpm in the hour after."
  const avgSpike = useMemo(() => {
    const coffeeDates = new Set(
      coffee.map((c) => new Date(c.logged_at).toISOString().slice(0, 10))
    );
    let coffeeSum = 0;
    let coffeeCount = 0;
    let noCoffeeSum = 0;
    let noCoffeeCount = 0;
    for (const h of hr) {
      if (h.restingHr == null) continue;
      if (coffeeDates.has(h.date)) {
        coffeeSum += h.restingHr;
        coffeeCount += 1;
      } else {
        noCoffeeSum += h.restingHr;
        noCoffeeCount += 1;
      }
    }
    if (coffeeCount === 0 || noCoffeeCount === 0) return null;
    return Math.round(coffeeSum / coffeeCount - noCoffeeSum / noCoffeeCount);
  }, [hr, coffee]);

  const onLogCoffee = useCallback(async () => {
    setPosting(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Sign in first.");
      const { log } = await postCoffee(token, { notes: null });
      setCoffee((prev) => [log, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPosting(false);
    }
  }, [getIdToken]);

  return (
    <>
      {/* Backdrop — only present when open. Click anywhere outside the
          panel to close. Visually invisible (no tint, no blur). */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Wrapper holding both the tab and the panel. The wrapper slides as
          one unit so the tab moves with the panel — when closed, the tab
          sits at the right edge of the viewport; when open, the tab sits
          at the left edge of the panel like a notebook bookmark. */}
      <div
        ref={(el) => {
          // capture for focus management later if needed
          if (el && panelRef.current !== (el as unknown as HTMLElement)) {
            // no-op: ref stored implicitly via panel
          }
        }}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] pointer-events-none"
        style={{
          transform: open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
          transition: "transform 300ms cubic-bezier(0.25,1,0.5,1)",
          willChange: "transform",
        }}
      >
        {/* Tab — absolutely positioned just outside the wrapper to the left.
            Visible whether the panel is open or closed. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="vitals-panel"
          aria-label={open ? "Close vitals panel" : "Open vitals panel"}
          className={[
            "absolute top-1/2 right-full -translate-y-1/2",
            "pointer-events-auto",
            "bg-paper border border-rule border-r-0",
            "px-2 py-4",
            "text-mono font-mono",
            "text-ink-soft hover:text-accent",
            "transition-colors duration-100",
            "focus:outline-none focus-visible:outline focus-visible:outline-2",
            "focus-visible:outline-offset-2 focus-visible:outline-accent",
          ].join(" ")}
        >
          <span
            className="block"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            vitals
          </span>
        </button>

        {/* Panel */}
        <aside
          ref={panelRef}
          id="vitals-panel"
          aria-label="Vitals"
          aria-hidden={!open}
          className={[
            "h-full bg-paper border-l border-rule",
            "pointer-events-auto",
            "overflow-y-auto",
            "px-6 py-8",
          ].join(" ")}
        >
          <header className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-h2 font-medium text-ink">Vitals</h2>
            <span className="font-mono text-mono text-ink-soft">
              last 30 days
            </span>
          </header>

          {loading && (
            <p className="mt-6 italic text-ink-muted text-small">fetching…</p>
          )}

          {error && !loading && (
            <p className="mt-6 text-small text-ink-soft">
              couldn&rsquo;t load: <span className="font-mono">{error}</span>
            </p>
          )}

          {loaded && !error && (
            <>
              <hr className="my-6" />

              {/* HR vs VIX */}
              <section aria-labelledby="vp-hr-vix">
                <h3
                  id="vp-hr-vix"
                  className="font-sans text-h3 font-semibold text-ink"
                >
                  Heart rate vs VIX
                </h3>
                <div className="mt-3" style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={merged}
                      margin={{ top: 8, right: 4, bottom: 0, left: -16 }}
                    >
                      <CartesianGrid
                        stroke="#E5E6E8"
                        strokeWidth={1}
                        vertical
                        horizontal
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) => shortDate(d as string)}
                        tick={{
                          fontSize: 10,
                          fontFamily:
                            "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                          fill: "#888C94",
                        }}
                        stroke="#D5D6D9"
                        tickLine={false}
                        interval="preserveStartEnd"
                        minTickGap={32}
                      />
                      <YAxis
                        yAxisId="hr"
                        orientation="left"
                        domain={["dataMin - 2", "dataMax + 2"]}
                        tick={{
                          fontSize: 10,
                          fontFamily:
                            "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                          fill: "#888C94",
                        }}
                        stroke="#D5D6D9"
                        tickLine={false}
                        width={32}
                      />
                      <YAxis
                        yAxisId="vix"
                        orientation="right"
                        domain={["dataMin - 1", "dataMax + 1"]}
                        tick={{
                          fontSize: 10,
                          fontFamily:
                            "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                          fill: "#888C94",
                        }}
                        stroke="#D5D6D9"
                        tickLine={false}
                        width={28}
                      />
                      <Tooltip
                        content={<NotebookTooltip />}
                        cursor={{ stroke: "#D5D6D9", strokeWidth: 1 }}
                      />
                      <Line
                        yAxisId="hr"
                        type="monotone"
                        dataKey="restingHr"
                        stroke="#1B1F26"
                        strokeWidth={1.5}
                        dot={CoffeeDot}
                        activeDot={{
                          r: 3,
                          fill: "#1B1F26",
                          stroke: "#FAFAF8",
                          strokeWidth: 1.5,
                        }}
                        isAnimationActive={false}
                        connectNulls
                      />
                      <Line
                        yAxisId="vix"
                        type="monotone"
                        dataKey="vix"
                        stroke="#3F5A82"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        dot={false}
                        activeDot={{
                          r: 3,
                          fill: "#3F5A82",
                          stroke: "#FAFAF8",
                          strokeWidth: 1.5,
                        }}
                        isAnimationActive={false}
                        connectNulls
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-3 font-mono text-mono text-ink-soft">
                  {agreeDays.pairs > 0
                    ? `You and the market agreed ${agreeDays.agree} of the last ${agreeDays.pairs} days.`
                    : "Not enough overlap to compute a correlation."}
                </p>
                <p className="mt-1 font-mono text-mono text-ink-muted">
                  <span className="inline-block w-3 align-middle border-t border-ink mr-1" />
                  hr{"  "}
                  <span
                    className="inline-block w-3 align-middle border-t border-accent ml-2 mr-1"
                    style={{ borderStyle: "dashed" }}
                  />
                  vix{"  "}
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink ml-2 mr-1 align-middle border border-paper" />
                  coffee day
                </p>
              </section>

              <hr className="my-6" />

              {/* Coffee log */}
              <section aria-labelledby="vp-coffee">
                <h3
                  id="vp-coffee"
                  className="font-sans text-h3 font-semibold text-ink"
                >
                  Coffee log
                </h3>
                {coffee.length === 0 ? (
                  <p className="mt-3 text-small text-ink-soft">
                    No cups logged yet.
                  </p>
                ) : (
                  <ul className="list-notebook mt-3 text-small">
                    {coffee.slice(0, 12).map((c) => (
                      <li key={c.id}>
                        <span className="font-mono text-ink-soft">
                          {relativeDay(c.logged_at)}
                          {", "}
                          {timeOnly(c.logged_at)}
                        </span>
                        {c.notes ? (
                          <span className="ml-2 text-ink">— {c.notes}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center gap-4">
                  {user ? (
                    <>
                      <button
                        type="button"
                        onClick={onLogCoffee}
                        disabled={posting}
                        className={[
                          "inline-block border px-4 py-2 text-small font-medium",
                          "transition-colors duration-100",
                          "focus:outline-none focus-visible:outline focus-visible:outline-2",
                          "focus-visible:outline-offset-2 focus-visible:outline-accent",
                          posting
                            ? "border-rule text-ink-muted cursor-not-allowed"
                            : "border-ink text-ink hover:bg-ink hover:text-paper",
                        ].join(" ")}
                      >
                        {posting ? "logging…" : "Log a cup"}
                      </button>
                      <button
                        type="button"
                        onClick={() => signOutCurrentUser()}
                        className="text-small font-mono text-ink-soft hover:text-accent transition-colors duration-100"
                      >
                        sign out
                      </button>
                    </>
                  ) : authConfigured ? (
                    <button
                      type="button"
                      onClick={() => signInWithGoogle().catch(() => {})}
                      className="text-small font-mono text-accent underline underline-offset-2 hover:text-ink transition-colors duration-100"
                    >
                      sign in with Google to log →
                    </button>
                  ) : (
                    <span className="text-small font-mono text-ink-muted">
                      (sign-in disabled — frontend Firebase config missing)
                    </span>
                  )}
                </div>
              </section>

              <hr className="my-6" />

              {/* Stats */}
              <section aria-labelledby="vp-stats">
                <h3
                  id="vp-stats"
                  className="font-sans text-h3 font-semibold text-ink"
                >
                  Stats
                </h3>
                <ul className="mt-3 space-y-2 text-small">
                  <li>
                    Avg HR on coffee days vs not:{" "}
                    <span className="font-mono">
                      {avgSpike == null
                        ? "—"
                        : `${avgSpike >= 0 ? "+" : ""}${avgSpike} bpm`}
                    </span>
                  </li>
                  <li>
                    Cups this week:{" "}
                    <span className="font-mono">{cupsThisWeek}</span>
                  </li>
                  <li>
                    Most volatile day:{" "}
                    <span className="font-mono">{mostVolatileDay}</span>
                  </li>
                  <li>
                    Current resting HR:{" "}
                    <span className="font-mono">
                      {currentHr == null ? "—" : `${currentHr} bpm`}
                    </span>
                  </li>
                </ul>
              </section>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default VitalsPanel;
