# vitals-api

Express backend for the **vitals side panel** on `samhsteinmetz.github.io`.
It fronts three data sources so the React frontend never sees an API key:

| Method & path             | Source                | Auth            |
| ------------------------- | --------------------- | --------------- |
| `GET /api/hr`             | Fitbit resting HR     | none (public)   |
| `GET /api/hr-intraday`    | Fitbit per-minute HR  | none (public)   |
| `GET /api/vix`            | Yahoo Finance (`^VIX`)| none (public)   |
| `GET /api/coffee`         | Postgres `coffee_logs`| none (public)   |
| `POST /api/coffee`        | Postgres `coffee_logs`| Firebase ID token |

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

### 4. Register a Fitbit app + get initial tokens

1. Sign in at <https://dev.fitbit.com> → **Manage → Register an App**.
2. Application type: **Personal** (single user → access to intraday data).
3. OAuth 2.0 Application Type: **Personal**; Callback URL can be
   `http://localhost` for the manual token flow.
4. Note the **Client ID** and **Client Secret**.
5. Use the [OAuth 2.0 tutorial](https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/)
   to obtain an initial **access token** and **refresh token** with the
   `heart` and `activity` scopes.
6. The server auto-refreshes the access token on 401 and writes the new pair
   to `tokens.json` (gitignored). The initial env values seed the first call.

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
  FITBIT_CLIENT_ID="..." \
  FITBIT_CLIENT_SECRET="..." \
  FITBIT_ACCESS_TOKEN="..." \
  FITBIT_REFRESH_TOKEN="..." \
  FIREBASE_SERVICE_ACCOUNT_JSON="$(cat path/to/service-account.json)" \
  --app samhsteinmetz-vitals-api
# DATABASE_URL and PORT are set by Heroku automatically.
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

- **CORS** is locked to `ALLOWED_ORIGIN`; local Vite origins (5173/4173) are
  additionally allowed for development.
- **Intraday HR** responses are cached in memory per date for 1 hour to keep
  the per-coffee response-curve fetches fast.
- **Token write-back** to `tokens.json` works locally; Heroku's filesystem is
  ephemeral, so after a dyno restart the seed env tokens are used again (and
  refreshed on the next 401).
- `POST /api/coffee` strips HTML from `notes`, caps it at 200 chars, and
  validates `timestamp` is a valid ISO date.
