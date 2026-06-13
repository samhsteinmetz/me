# vitals-api

Backend for the `/vitals` page on `samhsteinmetz.github.io`. Tiny Express
service that fronts three data sources so frontend code never sees API keys:

- `GET /api/hr` — daily resting heart rate from Fitbit
- `GET /api/vix` — daily ^VIX close from a Yahoo-Finance-style RapidAPI provider
- `GET /api/coffee` — coffee log entries from Heroku Postgres
- `POST /api/coffee` — adds a new coffee log; requires Firebase ID token
  whose email is on `ALLOWED_EMAILS`

The server runs cleanly with zero credentials configured: every endpoint
falls back to deterministic mock data and reports the source via an
`X-Data-Source` response header. This lets the frontend render the page
end-to-end during dev without anything being set up.

## Local setup

```bash
cd server
cp .env.example .env
# edit .env with whatever credentials you want to wire up
npm install
npm run dev
# → http://localhost:3001/health
```

Frontend reads `VITE_API_BASE_URL` (set in the repo root `.env`) — point it
at `http://localhost:3001` for dev or your Heroku URL for production.

## Deploy to Heroku

```bash
# from the repo root
heroku create samhsteinmetz-vitals-api
heroku addons:create heroku-postgresql:essential-0 --app samhsteinmetz-vitals-api
heroku config:set CORS_ORIGIN=https://samhsteinmetz.github.io --app samhsteinmetz-vitals-api

# copy each secret from your .env into Heroku config
heroku config:set FIREBASE_PROJECT_ID=... FIREBASE_CLIENT_EMAIL=... \
  FIREBASE_PRIVATE_KEY="$(cat firebase-key.txt)" \
  ALLOWED_EMAILS=samhsteinmetz@gmail.com \
  FITBIT_CLIENT_ID=... FITBIT_CLIENT_SECRET=... FITBIT_REFRESH_TOKEN=... \
  RAPIDAPI_KEY=... \
  --app samhsteinmetz-vitals-api

# Heroku deploys from this subdirectory via git subtree:
git subtree push --prefix server heroku main

# initialize the database schema (one time)
heroku run npm run db:init --app samhsteinmetz-vitals-api
```

## Required configuration

| Env var | Purpose | Without it |
|---|---|---|
| `DATABASE_URL` | Heroku Postgres connection string | In-memory store (resets on restart) |
| `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` (or `FIREBASE_SERVICE_ACCOUNT_JSON`) | Verify Firebase Google ID tokens server-side | POST `/api/coffee` returns 503 |
| `ALLOWED_EMAILS` | Comma-separated email allowlist | No one can POST |
| `FITBIT_CLIENT_ID` + `FITBIT_CLIENT_SECRET` + `FITBIT_REFRESH_TOKEN` | Personal-app OAuth flow | `/api/hr` returns deterministic mock data |
| `RAPIDAPI_KEY` + `RAPIDAPI_HOST` | VIX provider | `/api/vix` returns deterministic mock data |
| `CORS_ORIGIN` | Comma-separated frontend origins | Defaults to `http://localhost:5173` |
| `MOCK_DATA=true` | Force every endpoint into mock mode | Off by default |

## Routes

### `GET /api/hr?days=30`
```json
{
  "source": "fitbit" | "mock" | "mock-fallback",
  "series": [{ "date": "2026-05-15", "restingHr": 63 }, ...]
}
```

### `GET /api/vix?days=30`
```json
{
  "source": "rapidapi" | "mock" | "mock-fallback",
  "series": [{ "date": "2026-05-15", "vix": 16.4 }, ...]
}
```

### `GET /api/coffee?days=30`
```json
{
  "source": "postgres" | "mock" | "memory",
  "logs": [{ "id": 1, "logged_at": "2026-06-12T13:42:00Z", "notes": "iced" }, ...]
}
```

### `POST /api/coffee`
Headers: `Authorization: Bearer <firebase-id-token>`
Body (all optional): `{ "logged_at": "2026-06-13T...", "notes": "..." }`
Returns `201` with the inserted row.

## Notes

- The Fitbit refresh-token flow is the "Personal" application pattern — single user,
  long-lived refresh token stored as an env var. For production multi-user this
  would need a token store; for a portfolio site it's fine.
- VIX endpoint expects a Yahoo-Finance-shaped chart response; if you swap
  providers, adjust the parsing in `lib/vix.js`.
- All POST input is length-capped (`notes` to 280 chars, body to 32 KB) and the
  email allowlist gates writes. Read endpoints are public on purpose so the
  page is shareable.
