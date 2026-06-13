# Deployment

Two pieces ship separately:

- **Frontend** — Vite + React, served by **GitHub Pages**.
- **Backend** — Express API under [`server/`](./server), served by **Heroku**.
  See [`server/README.md`](./server/README.md) for the full backend guide.

> This project is built with **Vite**, so client env vars use the `VITE_`
> prefix and are read via `import.meta.env` (the brief's `REACT_APP_*` names map
> 1:1 to `VITE_*`). Routing uses **HashRouter** because GitHub Pages has no
> server-side routing.

---

## 1. Frontend env vars (set before `npm run build`)

Create `.env.local` in the repo root (see `.env.example`):

| Variable                     | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `VITE_API_URL`               | Backend base URL (your Render app URL in prod)      |

No secrets/tokens belong in the frontend. The only backend coordinate the
client knows is `VITE_API_URL`; everything sensitive stays server-side.
`.env.production` already sets this to the deployed backend for `npm run build`.

## 2. Backend env vars (set in Heroku config vars)

| Variable                        | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`                  | Postgres connection (set automatically by add-on)|
| `GOOGLE_HEALTH_CLIENT_ID`       | Google OAuth 2.0 client id                        |
| `GOOGLE_HEALTH_CLIENT_SECRET`   | Google OAuth 2.0 client secret                    |
| `GOOGLE_HEALTH_REFRESH_TOKEN`   | durable refresh token (from `/auth/google`)       |
| `GOOGLE_HEALTH_ACCESS_TOKEN`    | optional initial access token (auto-refreshes)    |
| `GOOGLE_HEALTH_REDIRECT_URI`    | must match the URI registered in Cloud Console    |
| `DATABASE_URL`                  | managed Postgres (Neon/Supabase) connection string|
| `COFFEE_WRITE_TOKEN`            | secret required to POST coffee logs (keep private)|
| `ALLOWED_ORIGIN`                | allowed origins, comma-separated (no wildcard)   |
| `PORT`                          | set automatically by the host                    |

## 3. Coffee log storage + write token

1. Create a free Postgres database (e.g. [Neon](https://neon.tech) or
   [Supabase](https://supabase.com)) and copy its connection string into
   `DATABASE_URL`.
2. Run the schema once: `psql "$DATABASE_URL" -f server/schema.sql`.
3. Generate a write token and set it as `COFFEE_WRITE_TOKEN`:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Log a cup from anywhere (never from the public site):
   ```bash
   curl -X POST "$VITE_API_URL/api/coffee" \
     -H "Authorization: Bearer $COFFEE_WRITE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"timestamp":"'"$(date -u +%FT%TZ)"'","notes":"latte"}'
   ```

## 4. Google Health API setup

1. In [Google Cloud Console](https://console.cloud.google.com/), enable the
   **Health API** and request the read-only health scopes.
2. Create an **OAuth 2.0 Client ID** (Web application) and register the redirect
   URI `https://<your-host>/auth/google/callback`.
3. Copy the Client ID / Secret into the backend env vars.
4. After deploying, visit `https://<your-host>/auth/google` once, consent, and
   copy the printed **refresh token** into `GOOGLE_HEALTH_REFRESH_TOKEN`.

## 5. Push the frontend to GitHub Pages

```bash
npm install
npm run build      # tsc + vite build → dist/
npm run deploy     # gh-pages -d dist  (publishes dist/ to the gh-pages branch)
```

`package.json` already sets `"homepage": "https://samhsteinmetz.github.io/me"`
and `vite.config.ts` sets the matching `base`.

Alternatively, automate with a GitHub Actions workflow that runs the same build
and publishes `dist/` on push to `main`.

## 6. Push the backend to Heroku

```bash
heroku create samhsteinmetz-vitals-api
heroku addons:create heroku-postgresql:essential-0 --app samhsteinmetz-vitals-api
# set all backend config vars (see table above), then:
heroku pg:psql --app samhsteinmetz-vitals-api < server/schema.sql
git subtree push --prefix server heroku main
```

## Final checklist

- [ ] `VITE_API_URL` points at the deployed backend
- [ ] `ALLOWED_ORIGIN` on the backend includes the GitHub Pages origin
- [ ] Google Health vars set on the backend; `/auth/google` run once and refresh
      token saved to env
- [ ] `DATABASE_URL` (Neon/Supabase) set and `server/schema.sql` applied
- [ ] `COFFEE_WRITE_TOKEN` set on the backend, kept off the frontend
- [ ] No secrets in the frontend build (`dist/`) — only `VITE_*` public values
