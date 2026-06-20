// routes/auth.js — one-time Google OAuth flow to mint Health API tokens.
//
//   GET /auth/google           → redirect to Google's consent screen
//   GET /auth/google/callback  → exchange ?code= for access + refresh tokens
//
// This is a personal, single-user flow: run it once, copy the printed refresh
// token into the GOOGLE_HEALTH_REFRESH_TOKEN env var, and the API routes
// auto-refresh from there on. Tokens are also held in memory for this process.

import { Router } from "express";
import {
  consentUrl,
  redirectUri,
  exchangeCodeForTokens,
} from "../googleHealth.js";

const router = Router();

router.get("/auth/google", (req, res) => {
  if (!process.env.GOOGLE_HEALTH_CLIENT_ID) {
    return res
      .status(500)
      .send("GOOGLE_HEALTH_CLIENT_ID is not configured on the server.");
  }
  res.redirect(consentUrl(redirectUri(req)));
});

router.get("/auth/google/callback", async (req, res) => {
  const code = String(req.query.code || "");
  const error = req.query.error;
  if (error) {
    return res.status(400).send(`Google returned an error: ${error}`);
  }
  if (!code) {
    return res.status(400).send("Missing ?code in callback.");
  }

  try {
    // Log the exact redirect_uri sent to Google — it must byte-for-byte match
    // both the one used at consent time and one registered in Cloud Console, or
    // the exchange fails with invalid_grant.
    const uri = redirectUri(req);
    console.log("[/auth/google/callback] redirect_uri =", uri);
    const tokens = await exchangeCodeForTokens(code, uri);

    // Log clearly so the values can be copied into Render env vars.
    console.log("\n==== GOOGLE HEALTH TOKENS ====");
    console.log("GOOGLE_HEALTH_ACCESS_TOKEN =", tokens.access_token);
    console.log("GOOGLE_HEALTH_REFRESH_TOKEN =", tokens.refresh_token);
    console.log("==============================\n");

    const refreshNote = tokens.refresh_token
      ? ""
      : `<p style="color:#b00">No refresh_token was returned. Revoke prior
         access at <a href="https://myaccount.google.com/permissions">Google
         account permissions</a> and try again so Google re-prompts consent.</p>`;

    res.set("Content-Type", "text/html").send(`
      <!doctype html>
      <meta charset="utf-8" />
      <title>Google Health connected</title>
      <body style="font-family:ui-monospace,monospace;max-width:760px;margin:40px auto;line-height:1.5">
        <h1>Google Health connected ✅</h1>
        <p>Copy these into your Render environment variables, then redeploy:</p>
        <h3>GOOGLE_HEALTH_REFRESH_TOKEN</h3>
        <pre style="white-space:pre-wrap;background:#f4f4f4;padding:12px;border-radius:8px">${
          tokens.refresh_token || "(none returned)"
        }</pre>
        <h3>GOOGLE_HEALTH_ACCESS_TOKEN</h3>
        <pre style="white-space:pre-wrap;background:#f4f4f4;padding:12px;border-radius:8px">${
          tokens.access_token || "(none returned)"
        }</pre>
        ${refreshNote}
        <p>The refresh token is the durable one — the access token is refreshed
        automatically when it expires.</p>
      </body>
    `);
  } catch (err) {
    console.error("[/auth/google/callback]", err.message);
    res
      .status(502)
      .send(
        `Token exchange failed: ${err.message}\n\n` +
          `redirect_uri used: ${redirectUri(req)}\n` +
          `This must exactly match an Authorized redirect URI on your OAuth ` +
          `client in Google Cloud Console.`
      );
  }
});

export default router;
