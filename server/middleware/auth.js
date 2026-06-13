// middleware/auth.js — Firebase ID token verification.
//
// Initializes firebase-admin from FIREBASE_SERVICE_ACCOUNT_JSON (the full
// service-account JSON pasted as a single string — easier than a file path
// on Heroku). Exports an Express middleware that requires a valid Google
// ID token in the Authorization header before allowing the request through.

import admin from "firebase-admin";

let initialized = false;
let available = false;

function init() {
  if (initialized) return;
  initialized = true;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    console.warn(
      "[auth] FIREBASE_SERVICE_ACCOUNT_JSON not set — POST routes will reject all requests with 503."
    );
    return;
  }

  try {
    const serviceAccount = JSON.parse(json);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    available = true;
  } catch (err) {
    console.error(
      "[auth] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
      err.message
    );
  }
}

/** @returns {boolean} whether Firebase Admin is configured. */
export function hasAuth() {
  init();
  return available;
}

/**
 * Express middleware. Verifies "Authorization: Bearer <idToken>" via
 * admin.auth().verifyIdToken. On success sets req.user = decodedToken and
 * calls next(); otherwise responds 401 { error: "Unauthorized" }.
 *
 * If the optional ALLOWED_EMAILS env var is set (comma-separated), the
 * verified email must be on the list — keeps the personal log single-user.
 */
export async function verifyFirebaseToken(req, res, next) {
  init();

  if (!available) {
    return res.status(503).json({
      error: "Auth not configured",
      message: "FIREBASE_SERVICE_ACCOUNT_JSON is not set on the server.",
    });
  }

  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);

    const allowList = (process.env.ALLOWED_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (
      allowList.length > 0 &&
      !allowList.includes((decoded.email || "").toLowerCase())
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("[auth] Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export default verifyFirebaseToken;
