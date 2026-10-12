# IIT Madras Study Planner & Tracker

A React study planner with daily tasks, subjects, study duration tracking, Pomodoro sessions, notes, and progress stickers.

## Authentication

- Separate `/login` and `/register` pages.
- Email/password registration and login with salted scrypt password hashes.
- Official Google sign-in button; Google ID tokens are verified on the backend.
- MySQL-backed users and revocable HttpOnly cookie sessions.
- Tasks and notes are scoped to the authenticated user; client-supplied email addresses cannot select another account.
- Failed database writes are shown as errors instead of successful local saves.

## Quick start

```bash
npm ci
cp .env.example .env
# Fill your MySQL settings and GOOGLE_CLIENT_ID in .env
npm run client
```

Open http://localhost:3000. Vite includes the backend API during development.

```bash
npm test
npm run build
# For a standalone production Node server:
# set APP_ORIGIN to the server's HTTPS origin and NODE_ENV=production
npm start
```

See [AUTH_SETUP.md](AUTH_SETUP.md) for MySQL permissions, Google Cloud OAuth origins, Node/Vercel deployment, and verification limits. Keep `.env` private. Google sign-in cannot work until a real OAuth Web Client ID and allowed origins are configured.

Local development can use SQLite automatically when MySQL is unavailable. The fallback database is stored in `server/study_tracker.db`. Production never falls back to SQLite: set `NODE_ENV=production`, configure MySQL, and resolve any MySQL/schema initialization error before serving requests. Set `ALLOW_SQLITE_FALLBACK=false` to disable the local fallback.

## Stack

React 18, Vite, Tailwind CSS, Express API, MySQL (`mysql2`), Google Auth Library, and optional local SQLite (`better-sqlite3`).
