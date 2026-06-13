# vitals-api

Express backend for the **vitals side panel** on `samhsteinmetz.github.io`.
It fronts three data sources so the React frontend never sees an API key:

| Method & path             | Source                       | Auth            |
| ------------------------- | ---------------------------- | --------------- |
| `GET /api/health`         | liveness probe               | none (public)   |
| `GET /api/hr`             | Google Health daily resting HR | none (public) |
| `GET /api/hr-intraday`    | Google Health per-minute HR  | none (public)   |
| `GET /api/vix`            | Yahoo Finance (`^VIX`)       | none (public)   |
| `GET /api/coffee`         | Postgres `coffee_logs`       | none (public)   |
| `POST /api/coffee`        | Postgres `coffee_logs`       | Firebase ID token |
| `GET /auth/google`        | OAuth consent redirect       | none (one-time) |
| `GET /auth/google/callback` | OAuth code → tokens        | none (one-time) |

> The server runs with **zero credentials** — every endpoint falls back to
> deterministic mock data (see `X-Data-Source` response header). This lets the
> frontend render end-to-end before any integration is wired up.

## Endpoint shapes

```jsonc
GET /api/hr           → [{ "date": "2024-05-01", "restingHR": 58 }, ...]
GET /api/hr-intraday?date=2024-05-14
                      → [{ "time": "09:00:00", "value": 62 }, ...]
GET /api/vix          → [{ "date": "2024-05-01", "vix": 14.2 }, ...]
GET /api/coffee       → [{ "id": 1, "timestamp": "2024-05-14T09:23:00Z", "notes": "double espresso" }, ...]
POST /api/coffee      ← { "timestamp": "<ISO>", "notes": "optional" }
                      → { "success": true, "entry": { "id", "timestamp", "notes" } }
```

`POST /api/coffee` requires `Authorization: Bearer <firebase-id-token>`.

## Local development

```bash
cd server
cp .env.example .env       # optional — runs in mock mode with no edits
npm install
npm run dev                # → http://localhost:3001/health
```

---

## Deployment guide (Heroku)

### 1. Redeem Heroku credits (GitHub Student Developer Pack)

1. Go to <https://education.github.com/pack> and verify your student status.
2. Find the **Heroku** offer and click through to claim it.
3. In your [Heroku account billing settings](https://dashboard.heroku.com/account/billing),
   confirm the platform credits are applied. (Heroku also requires a verified
   credit card on file even when using credits.)

### 2. Create the Heroku app + Postgres add-on

```bash
heroku login
heroku create samhsteinmetz-vitals-api
heroku addons:create heroku-postgresql:essential-0 --app samhsteinmetz-vitals-api
# DATABASE_URL is now set automatically in the app's config vars.
```

### 3. Create the database schema

```bash
# Easiest: pipe schema.sql straight into the attached database.
heroku pg:psql --app samhsteinmetz-vitals-api < schema.sql

# Or, after the first deploy:
heroku run npm run db:init --app samhsteinmetz-vitals-api
```

### 4. Register a Google Health OAuth app + run the auth flow

1. In [Google Cloud Console](https://console.cloud.google.com/), enable the
   **Health API** and request access to the read-only health scopes used here.
2. Create an **OAuth 2.0 Client ID** (type: Web application). Add this exact
   redirect URI: `https://<your-host>/auth/google/callback`.
3. Copy the **Client ID** and **Client secret** into `GOOGLE_HEALTH_CLIENT_ID`
   and `GOOGLE_HEALTH_CLIENT_SECRET`.
4. Deploy, then visit `https://<your-host>/auth/google` once and consent. The
   callback page prints `GOOGLE_HEALTH_ACCESS_TOKEN` and
   `GOOGLE_HEALTH_REFRESH_TOKEN` (also logged to the server console).
5. Paste the **refresh token** into `GOOGLE_HEALTH_REFRESH_TOKEN` and redeploy.
   The server then auto-refreshes the short-lived access token on any 401.

Scopes requested (read-only): `googlehealth.activity_and_fitness`,
`googlehealth.health_metrics_and_measurements`, `googlehealth.sleep`.

### 5. Get the Firebase service-account JSON

1. [Firebase Console](https://console.firebase.google.com/) → your project →
   **Project Settings → Service accounts**.
2. **Generate new private key** → downloads a JSON file.
3. You will paste the **entire file contents as one string** into the
   `FIREBASE_SERVICE_ACCOUNT_JSON` config var (next step).

### 6. Set all Heroku config vars

```bash
heroku config:set \
  ALLOWED_ORIGIN="https://samhsteinmetz.github.io" \
  ALLOWED_EMAILS="samhsteinmetz@gmail.com" \
  GOOGLE_HEALTH_CLIENT_ID="..." \
  GOOGLE_HEALTH_CLIENT_SECRET="..." \
  GOOGLE_HEALTH_REFRESH_TOKEN="..." \
  GOOGLE_HEALTH_REDIRECT_URI="https://<your-host>/auth/google/callback" \
  FIREBASE_SERVICE_ACCOUNT_JSON="$(cat path/to/service-account.json)" \
  --app samhsteinmetz-vitals-api
# DATABASE_URL and PORT are set by the platform automatically.
# (On Render, set the same keys under the service's Environment tab.)
```

### 7. Deploy

This backend lives in the `server/` subdirectory of the frontend repo, so push
it to Heroku with `git subtree`:

```bash
# from the repository root
git subtree push --prefix server heroku main
```

If you instead keep the backend in its own repo, a plain `git push heroku main`
works.

---

## Notes

- **CORS** is locked to `ALLOWED_ORIGIN` (comma-separated list; no wildcard).
  Add your local Vite origin to that list when developing against this server.
- **Intraday HR** responses are cached in memory per date for 1 hour to keep
  the per-coffee response-curve fetches fast.
- **Token refresh** happens in memory: the durable `GOOGLE_HEALTH_REFRESH_TOKEN`
  env var mints a fresh access token whenever the API returns 401. All OAuth
  logic lives in `googleHealth.js` and is shared by every route.
- **Data type naming** quirk: kebab-case in the URL path (`heart-rate`,
  `daily-resting-heart-rate`) but snake_case in filters
  (`heart_rate.sample_time.civil_time`, `daily_resting_heart_rate.date`).
- `POST /api/coffee` strips HTML from `notes`, caps it at 200 chars, and
  validates `timestamp` is a valid ISO date.
