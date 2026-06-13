import admin from "firebase-admin";

let initialized = false;
let allowedEmails = [];

function init() {
  if (initialized) return;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let credential = null;

  if (json) {
    try {
      credential = admin.credential.cert(JSON.parse(json));
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
    }
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Heroku-style env vars escape newlines; un-escape them.
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }

  if (credential && !admin.apps.length) {
    admin.initializeApp({ credential });
  }

  allowedEmails = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  initialized = true;
}

export function hasAuth() {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      (process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY)
  );
}

/**
 * Require a valid Firebase ID token whose email is on the allowlist.
 * Attaches `req.user = { uid, email }` on success.
 */
export async function requireAllowedUser(req, res, next) {
  init();

  if (!hasAuth()) {
    return res.status(503).json({
      error: "auth_not_configured",
      message:
        "Firebase service account env vars are not set on the server. POST routes are disabled.",
    });
  }

  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    const email = (decoded.email || "").toLowerCase();
    if (!email || !allowedEmails.includes(email)) {
      return res.status(403).json({ error: "not_allowed" });
    }
    req.user = { uid: decoded.uid, email };
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err.message);
    return res.status(401).json({ error: "invalid_token" });
  }
}
