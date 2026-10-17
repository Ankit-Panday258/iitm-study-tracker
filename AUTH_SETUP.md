# Authentication and database setup

The app now has separate `/login` and `/register` pages. Both offer the official Google Identity Services button once configured. Passwords use salted scrypt hashes. Successful authentication creates a revocable, seven-day HttpOnly cookie session stored in MySQL. API identity comes from that session, never an email sent by the browser. Database failures do not produce successful local-only saves.

## Run locally

1. Install Node.js 20+ and run `npm ci`.
2. Copy `.env.example` to `.env` and set your MySQL credentials or `MONGODB_URI`. Keep `.env` private.
3. For local development, keep `ALLOW_SQLITE_FALLBACK=true` to save to the persistent `server/study_tracker.db` file if MySQL is unavailable. To require MySQL locally, set `ALLOW_SQLITE_FALLBACK=false`. For production MySQL, set `NODE_ENV=production`, set `DATABASE_DRIVER=mysql`, and create the selected database in your MySQL provider before starting the app. For MongoDB Atlas, set `DATABASE_DRIVER=mongodb` and provide the Atlas connection string as `MONGODB_URI`.
4. Set `APP_ORIGIN=http://localhost:3000` and run `npm run client`. Vite serves the frontend and the same backend API at http://localhost:3000. Development requests use the actual Vite origin, independently of a production APP_ORIGIN setting. Configured production origins are normalized, so a trailing slash is accepted. Do not need a second server for development.
5. Alternatively run `npm run build` then `npm start` to serve the complete app on port 3001. Set `APP_ORIGIN=http://localhost:3001` for this mode.

## Google sign-in

Create a Google Cloud OAuth **Web application** client and configure the consent screen. Add the exact frontend origin (for example `http://localhost:3000`) to Authorized JavaScript origins. Put that client ID in `GOOGLE_CLIENT_ID` on the server. Restart after changing `.env`; the frontend gets the public client ID from `/api/auth/config`.

The server uses Google's library to validate token signature, audience, issuer and expiry. Unverified emails and simulated credentials are rejected. Existing password accounts are not silently linked by matching email; those users keep using their password. The verified Google `sub` identifies returning Google accounts.

## Admin panel

Set `ADMIN_EMAILS` on the server to a comma-separated list of account email addresses, for example `ADMIN_EMAILS=owner@example.com`. Restart the server, then sign in with one of those accounts; the **एडमिन पैनल** button appears in the app. Admins can create user accounts with a password and add courses/subjects. Admin access is checked by the server on every admin API request. Keep this setting private and only list trusted accounts. A newly created user can sign in with the password set in the panel.

Official reference: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

## Deployment

For a Node host: build and run `npm start`, provide a persistent reachable MySQL database or MongoDB Atlas connection, set `NODE_ENV=production` and `APP_ORIGIN` to the exact HTTPS site origin, and add that origin to the Google OAuth client. Sessions use Secure cookies in production.

For Vercel: the included `api/index.js` and API rewrite provide backend endpoints; static frontend rewrites alone cannot authenticate or save data. Connect a MongoDB Atlas integration to the project, set `DATABASE_DRIVER=mongodb` for the deployment environment, and let the integration provide `MONGODB_URI`. Production mode never uses the local SQLite fallback.

Users, sessions, tasks, subjects and notes are saved to the selected database. Study records and notes are scoped to the signed-in user's email. Old local records are not automatically copied to a newly created cloud database.

## Verification performed

- `npm test`: registration, duplicate emails, password checks, persisted sessions, logout, task ownership, note isolation and forged Google credentials.
- A mocked verified Google response tests account persistence and reuse; it does not replace a live OAuth login test.
- `npm run build` and browser checks for registration, login, logout and refresh session restoration.
- Tests passed against both isolated SQLite and a newly generated MySQL test database. The MySQL test database is removed after testing; existing app records are untouched.
- Run `npm run test:mysql` to repeat real MySQL tests using your `.env` connection settings. The account needs permission to create and drop the generated test database.
- The real Google button loaded, but Google rejected `http://localhost:3000` because that origin has not been authorized for the configured OAuth client. Add that exact origin in Google Cloud before the live Google login test.

The in-process sign-in attempt limiter is useful for a single Node server; multi-instance hosting should also apply a shared rate limit at the gateway.
