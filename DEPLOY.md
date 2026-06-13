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
| `VITE_API_URL`               | Backend base URL (your Heroku app URL in prod)      |
| `VITE_FIREBASE_API_KEY`      | Firebase web config — API key                       |
| `VITE_FIREBASE_AUTH_DOMAIN`  | Firebase web config — auth domain                   |
| `VITE_FIREBASE_PROJECT_ID`   | Firebase web config — project id                    |
| `VITE_FIREBASE_APP_ID`       | Firebase web config — app id                        |

No secrets/tokens belong in the frontend. The only backend coordinate the
client knows is `VITE_API_URL`; everything sensitive stays server-side.

## 2. Backend env vars (set in Heroku config vars)

| Variable                        | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`                  | Heroku Postgres (set automatically by the add-on)|
| `FITBIT_CLIENT_ID`              | Fitbit app client id                             |
| `FITBIT_CLIENT_SECRET`          | Fitbit app client secret                         |
| `FITBIT_ACCESS_TOKEN`           | initial Fitbit access token (auto-refreshes)     |
| `FITBIT_REFRESH_TOKEN`          | initial Fitbit refresh token                     |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | full service-account JSON as one string          |
| `ALLOWED_ORIGIN`                | `https://samhsteinmetz.github.io`                |
| `ALLOWED_EMAILS`                | optional allowlist for who may log coffee        |
| `PORT`                          | set automatically by Heroku                      |

## 3. Firebase setup

1. Create a Firebase project; enable **Authentication → Google** provider.
2. Add a **Web app** → copy the config into the `VITE_FIREBASE_*` vars above.
3. **Project Settings → Service accounts → Generate new private key** → paste
   the whole JSON into `FIREBASE_SERVICE_ACCOUNT_JSON` on Heroku.
4. Add your GitHub Pages domain under **Authentication → Settings → Authorized
   domains** so `signInWithPopup` works in production.

## 4. Fitbit app registration

1. <https://dev.fitbit.com> → register a **Personal** app (needed for intraday).
2. Copy Client ID / Secret into the Heroku vars.
3. Use the [OAuth 2.0 tutorial](https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/)
   to get the initial access + refresh tokens (`heart`, `activity` scopes).

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

- [ ] `VITE_API_URL` points at the deployed Heroku backend
- [ ] `ALLOWED_ORIGIN` on Heroku equals the GitHub Pages origin
- [ ] Firebase Google provider enabled + GitHub Pages domain authorized
- [ ] Fitbit + Firebase service-account vars set on Heroku
- [ ] `server/schema.sql` applied to the database
- [ ] No secrets in the frontend build (`dist/`) — only `VITE_*` public values
