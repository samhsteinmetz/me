// VitalsPanel — persistent biometric side panel.
//
// Mounted once in Layout so it stays open across page navigation. A narrow tab
// on the right edge toggles a 380px (full-width on mobile) panel that slides in
// from the right. Fully readable when logged out; auth only gates coffee logging.
//
// Colors follow the brief's exact tokens: ink #1A1916, paper #FAFAF8,
// accent #2C4A6E, muted #6B6860.

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useVitalsData } from "../hooks/useVitalsData";
import {
  computeResponseCurve,
  joinHrVix,
  marketSyncCount,
} from "./vitals/analysis";
import HRVixChart from "./vitals/HRVixChart";
import CoffeeSection from "./vitals/CoffeeSection";
import StatsSection from "./vitals/StatsSection";

const INK = "#1A1916";
const PAPER = "#FAFAF8";
const MUTED = "#6B6860";

function Fetching() {
  return (
    <p style={{ fontSize: 13, color: MUTED }} className="italic">
      fetching…
    </p>
  );
}

export default function VitalsPanel() {
  const [open, setOpen] = useState(false);
  const [tabHover, setTabHover] = useState(false);

  const panelRef = useRef<HTMLElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  const { user, loading: authLoading, configured, signIn, signOut } = useAuth();
  const {
    hrData,
    vixData,
    coffeeData,
    intradayByDate,
    loading,
    hrError,
    hrAuthError,
    coffeeError,
    refetch,
  } = useVitalsData();

  // Escape to close; restore focus to the tab.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        tabRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const marketSync = useMemo(
    () => marketSyncCount(joinHrVix(hrData, vixData)),
    [hrData, vixData]
  );
  const response = useMemo(
    () => computeResponseCurve(coffeeData, intradayByDate),
    [coffeeData, intradayByDate]
  );

  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "you";

  return (
    <>
      {/* Click-outside backdrop (invisible). Only present when open. */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Toggle tab — fixed to the right edge, vertically centered. */}
      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setTabHover(true)}
        onMouseLeave={() => setTabHover(false)}
        aria-expanded={open}
        aria-controls="vitals-panel"
        aria-label="Open vitals panel"
        className="fixed right-0 top-1/2 z-30 -translate-y-1/2 focus:outline-none"
        style={{
          width: 32,
          background: PAPER,
          borderLeft: `1px solid ${tabHover ? INK : "rgba(26,25,22,0.2)"}`,
          borderTop: "1px solid rgba(26,25,22,0.2)",
          borderBottom: "1px solid rgba(26,25,22,0.2)",
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          padding: "16px 0",
          color: INK,
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: 12,
            letterSpacing: "0.05em",
          }}
          className="font-mono"
        >
          vitals
        </span>
      </button>

      {/* Panel */}
      <aside
        id="vitals-panel"
        ref={panelRef}
        aria-label="Vitals"
        aria-hidden={!open}
        {...(!open ? { inert: "" } : {})}
        className="vitals-panel vitals-scroll fixed right-0 top-0 z-50 flex flex-col"
        style={{
          height: "100vh",
          background: PAPER,
          borderLeft: "1px solid rgba(26,25,22,0.2)",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header: 48px, "vitals" left, auth control + close right. */}
        <header
          className="flex items-center justify-between"
          style={{
            height: 48,
            flex: "0 0 48px",
            padding: "0 16px",
            borderBottom: "1px solid rgba(26,25,22,0.1)",
          }}
        >
          <span className="font-serif" style={{ fontSize: "1rem", color: INK }}>
            vitals
          </span>
          <div className="flex items-center gap-3">
            {!authLoading && configured && (
              <>
                {user ? (
                  <span style={{ fontSize: 12, color: MUTED }}>
                    {firstName}{" "}
                    <span aria-hidden="true">·</span>{" "}
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="underline underline-offset-2 hover:opacity-70"
                      style={{ color: MUTED }}
                    >
                      sign out
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn().catch(() => {})}
                    style={{ fontSize: 12, color: MUTED }}
                    className="underline underline-offset-2 hover:opacity-70"
                  >
                    sign in
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close vitals panel"
              style={{ fontSize: 24, lineHeight: 1, color: INK }}
              className="leading-none hover:opacity-50"
            >
              ×
            </button>
          </div>
        </header>

        {/* Body — 32px horizontal padding (charts are width minus 32px/side). */}
        <div style={{ padding: "24px 32px" }} className="flex-1">
          {/* HR vs VIX */}
          <section aria-labelledby="vp-hrvix">
            <h3
              id="vp-hrvix"
              className="font-serif"
              style={{ fontSize: "0.9375rem", color: INK }}
            >
              Heart rate vs VIX
            </h3>
            <div className="mt-3">
              {loading ? (
                <Fetching />
              ) : hrAuthError ? (
                <p
                  style={{ fontSize: 12, color: MUTED }}
                  className="italic"
                >
                  Fitbit connection needs refresh.
                </p>
              ) : hrError ? (
                <p
                  style={{ fontSize: 12, color: MUTED }}
                  className="italic"
                >
                  Couldn&rsquo;t load heart rate data.
                </p>
              ) : (
                <HRVixChart hrData={hrData} vixData={vixData} />
              )}
            </div>
          </section>

          <hr style={{ borderColor: "rgba(26,25,22,0.1)", margin: "20px 0" }} />

          {/* Coffee */}
          {loading ? (
            <section>
              <h3
                className="font-serif"
                style={{ fontSize: "0.9375rem", color: INK }}
              >
                Coffee log
              </h3>
              <div className="mt-3">
                <Fetching />
              </div>
            </section>
          ) : (
            <CoffeeSection
              coffeeData={coffeeData}
              response={response}
              coffeeError={coffeeError}
              user={user}
              refetch={refetch}
            />
          )}

          <hr style={{ borderColor: "rgba(26,25,22,0.1)", margin: "20px 0" }} />

          {/* Stats */}
          {loading ? (
            <section>
              <h3
                className="font-serif"
                style={{ fontSize: "0.9375rem", color: INK }}
              >
                Stats
              </h3>
              <div className="mt-2">
                <Fetching />
                <Fetching />
                <Fetching />
              </div>
            </section>
          ) : (
            <StatsSection
              hrData={hrData}
              coffeeData={coffeeData}
              response={response}
              marketSync={marketSync}
            />
          )}
        </div>
      </aside>
    </>
  );
}
