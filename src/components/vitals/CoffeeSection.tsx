// CoffeeSection — the coffee log list, the average response curve, and (when
// signed in) the inline "log coffee" form.

import { useState } from "react";
import type { User } from "firebase/auth";
import { postCoffee, type CoffeeEntry } from "../../lib/api";
import type { ResponseCurve } from "./analysis";
import CoffeeResponseChart from "./CoffeeResponseChart";

const INK = "#1A1916";
const MUTED = "#6B6860";
const PAPER = "#FAFAF8";

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CoffeeSection({
  coffeeData,
  response,
  coffeeError,
  user,
  refetch,
}: {
  coffeeData: CoffeeEntry[];
  response: ResponseCurve;
  coffeeError: string | null;
  user: User | null;
  refetch: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );

  const visible = showAll ? coffeeData : coffeeData.slice(0, 7);

  async function submit() {
    if (!user) return;
    setStatus("saving");
    try {
      const token = await user.getIdToken();
      await postCoffee(token, {
        timestamp: new Date().toISOString(),
        notes: notes.trim() || null,
      });
      setNotes("");
      setFormOpen(false);
      setStatus("done");
      refetch();
      // "Logged." fades out after 2s.
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="vp-coffee">
      <h3
        id="vp-coffee"
        className="font-serif"
        style={{ fontSize: "0.9375rem", color: INK }}
      >
        Coffee log
      </h3>

      {coffeeError ? (
        <p style={{ fontSize: 12, color: MUTED }} className="mt-2 italic">
          Couldn&rsquo;t load coffee log.
        </p>
      ) : coffeeData.length === 0 ? (
        <p style={{ fontSize: 13, color: MUTED }} className="mt-2">
          No cups logged yet.
        </p>
      ) : (
        <>
          {/* Handwritten-log style: no bullets, no borders, line-height 1.8. */}
          <ul className="mt-2" style={{ lineHeight: 1.8, listStyle: "none" }}>
            {visible.map((entry) => (
              <li key={entry.id} style={{ fontSize: 13, color: INK }}>
                <span className="font-mono">{fmtTime(entry.timestamp)}</span>
                {entry.notes ? (
                  <span className="font-serif">{"  " + entry.notes}</span>
                ) : null}
              </li>
            ))}
          </ul>
          {coffeeData.length > 7 && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              style={{ fontSize: 12, color: MUTED }}
              className="mt-1 underline underline-offset-2 hover:opacity-70"
            >
              {showAll ? "show less" : "show all"}
            </button>
          )}
        </>
      )}

      {/* Average response curve (only meaningful with >=3 intraday samples). */}
      <CoffeeResponseChart response={response} />

      {/* Logging is gated on auth; the log itself is public to read. */}
      {user && (
        <div className="mt-4">
          {!formOpen ? (
            <button
              type="button"
              onClick={() => {
                setFormOpen(true);
                setStatus("idle");
              }}
              style={{
                width: "100%",
                minHeight: 44,
                border: `1px solid ${INK}`,
                color: INK,
                background: PAPER,
                fontSize: 13,
              }}
              className="px-3 py-2 transition-opacity hover:opacity-70"
            >
              Log coffee now
            </button>
          ) : (
            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="notes (optional)"
                maxLength={200}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                  if (e.key === "Escape") setFormOpen(false);
                }}
                style={{
                  width: "100%",
                  minHeight: 44,
                  border: `1px solid ${INK}`,
                  color: INK,
                  background: PAPER,
                  fontSize: 13,
                }}
                className="px-3 py-2 placeholder:opacity-50 focus:outline-none"
              />
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "saving"}
                  style={{
                    minHeight: 44,
                    border: `1px solid ${INK}`,
                    color: PAPER,
                    background: INK,
                    fontSize: 13,
                  }}
                  className="px-4 py-2 transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {status === "saving" ? "Logging…" : "Log"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setStatus("idle");
                  }}
                  style={{ fontSize: 13, color: MUTED }}
                  className="underline underline-offset-2 hover:opacity-70"
                >
                  cancel
                </button>
              </div>
            </div>
          )}

          {/* Confirmation / error line. */}
          <p
            aria-live="polite"
            style={{
              fontSize: 13,
              color: MUTED,
              opacity: status === "done" || status === "error" ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
            className="mt-2 italic h-5"
          >
            {status === "done"
              ? "Logged."
              : status === "error"
                ? "Something went wrong."
                : ""}
          </p>
        </div>
      )}
    </section>
  );
}
