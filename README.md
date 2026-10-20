# IIT Madras Study Planner & Tracker

A React study planner with daily tasks, subjects, study duration tracking, Pomodoro sessions, notes, and progress stickers.

## Authentication

- Separate `/login` and `/register` pages.
- Email/password registration and login with salted scrypt password hashes.
- Official Google sign-in button; Google ID tokens are verified on the backend.
- MySQL or MongoDB-backed users and revocable HttpOnly cookie sessions.
- Tasks and notes are scoped to the authenticated user; client-supplied email addresses cannot select another account.
- Failed database writes are shown as errors instead of successful local saves.

## Quick start

```bash
npm ci
cp .env.example .env
# Fill either your MySQL settings or MONGODB_URI, plus GOOGLE_CLIENT_ID in .env
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

See [AUTH_SETUP.md](AUTH_SETUP.md) for MySQL and MongoDB setup, Google Cloud OAuth origins, Node/Vercel deployment, and verification limits. Keep `.env` private. Google sign-in cannot work until a real OAuth Web Client ID and allowed origins are configured.

Local development can use SQLite automatically when MySQL is unavailable. The fallback database is stored in `server/study_tracker.db`. Production never falls back to SQLite: configure a reachable MySQL or MongoDB database and resolve any connection/schema initialization error before serving requests. Set `ALLOW_SQLITE_FALLBACK=false` to disable the local fallback.

## Stack

React 18, Vite, Tailwind CSS, Express API, MySQL (`mysql2`), Google Auth Library, and optional local SQLite (`better-sqlite3`).
# Goals and Notion sync

The Goals page is available from the planner. Goals are saved as the signed-in user's regular app records, but are kept out of the daily study-topic list. Completing a goal awards 10 points; every 100 points advances the displayed level. The page also shows the learner's rank by completed-goal points without exposing other learners' identities.

The connected Notion workspace now has a verified `Study Goals` database. To connect the app server, create a Notion integration with page editing capability, share that database with it, and configure these server environment variables:

```env
NOTION_TOKEN=secret_...
NOTION_GOALS_DATABASE_ID=fab18750-36f8-4ea5-8835-4498f938607a
```

Then open Goals and choose **Sync all goals** to backfill app goals. New goals are added immediately, and completion/edit/removal changes are sent to Notion as part of the app action. The database has `Name` (title), `Status` (select), `Goal ID` (rich text), `Points` (number), and `Owner` (rich text) properties. For a different workspace, set `NOTION_PARENT_PAGE_ID` to a page shared with the integration and omit `NOTION_GOALS_DATABASE_ID`; the setup action creates a new database and backfills existing goals.

This is app-to-Notion sync. Editing a row directly in Notion does not currently update the app. Notion webhooks can deliver changes to a secure, publicly reachable HTTPS endpoint, but this app needs a deployed endpoint plus a verified webhook subscription before Notion-to-app updates can be enabled. Localhost is not reachable by Notion. If credentials are absent, goals continue to work in the app and the Goals page explains the missing setup.
