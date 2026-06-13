// middleware/auth.js — write protection for the coffee log.
//
// The coffee log is PUBLIC to read, but writes (POST) require a shared secret
// sent as `Authorization: Bearer <COFFEE_WRITE_TOKEN>`. Keep this token OFF the
// public site (it would be visible in the static bundle) — use it from curl,
// an iOS Shortcut, or any private tool. No Firebase / user accounts needed.

import { timingSafeEqual } from "node:crypto";

/** @returns {boolean} whether a write token is configured. */
export function hasAuth() {
  return Boolean(process.env.COFFEE_WRITE_TOKEN);
}

// Constant-time string compare to avoid leaking the token via timing.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Express middleware. Requires `Authorization: Bearer <COFFEE_WRITE_TOKEN>`.
 * Responds 503 if no token is configured, 401 if the token is missing/wrong.
 */
export function verifyWriteToken(req, res, next) {
  const expected = process.env.COFFEE_WRITE_TOKEN;
  if (!expected) {
    return res.status(503).json({
      error: "Auth not configured",
      message: "COFFEE_WRITE_TOKEN is not set on the server.",
    });
  }

  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match || !safeEqual(match[1], expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

export default verifyWriteToken;
