// CoffeeSection — the coffee log list and the average response curve.
//
// Read-only: the public site only displays the log. New cups are added
// privately via the backend's token-protected POST /api/coffee (curl / iOS
// Shortcut), so no sign-in or logging form ships in the static bundle.

import { useState } from "react";
import type { CoffeeEntry } from "../../lib/api";
import type { ResponseCurve } from "./analysis";
import CoffeeResponseChart from "./CoffeeResponseChart";

const INK = "#1A1916";
const MUTED = "#6B6860";

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
}: {
  coffeeData: CoffeeEntry[];
  response: ResponseCurve;
  coffeeError: string | null;
}) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? coffeeData : coffeeData.slice(0, 7);

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
    </section>
  );
}
