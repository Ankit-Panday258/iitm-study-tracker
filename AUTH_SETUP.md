# Authentication and MySQL setup

The app now has separate `/login` and `/register` pages. Both offer the official Google Identity Services button once configured. Passwords use salted scrypt hashes. Successful authentication creates a revocable, seven-day HttpOnly cookie session stored in MySQL. API identity comes from that session, never an email sent by the browser. Database failures do not produce successful local-only saves.

## Run locally

1. Install Node.js 20+ and run `npm ci`.
2. Copy `.env.example` to `.env` and set your MySQL host, port, user, password and database. Keep `.env` private.
3. Set `DATABASE_DRIVER=mysql`. The MySQL account needs permission to create the selected database if it does not exist, and create/alter/read/write its tables.
4. Set `APP_ORIGIN=http://localhost:3000` and run `npm run client`. Vite serves the frontend and the same backend API at http://localhost:3000. Development requests use the actual Vite origin, independently of a production APP_ORIGIN setting. Configured production origins are normalized, so a trailing slash is accepted. Do not need a second server for development.
5. Alternatively run `npm run build` then `npm start` to serve the complete app on port 3001. Set `APP_ORIGIN=http://localhost:3001` for this mode.

## Google sign-in

Create a Google Cloud OAuth **Web application** client and configure the consent screen. Add the exact frontend origin (for example `http://localhost:3000`) to Authorized JavaScript origins. Put that client ID in `GOOGLE_CLIENT_ID` on the server. Restart after changing `.env`; the frontend gets the public client ID from `/api/auth/config`.

The server uses Google's library to validate token signature, audience, issuer and expiry. Unverified emails and simulated credentials are rejected. Existing password accounts are not silently linked by matching email; those users keep using their password. The verified Google `sub` identifies returning Google accounts.

Official reference: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

## Deployment

For a Node host: build and run `npm start`, provide a persistent reachable MySQL database, set `NODE_ENV=production` and `APP_ORIGIN` to the exact HTTPS site origin, and add that origin to the Google OAuth client. Sessions use Secure cookies in production.

For Vercel: the included `api/index.js` and API rewrite provide backend endpoints; static frontend rewrites alone cannot authenticate or save data. Configure the same server environment variables and use a MySQL server reachable from Vercel. Do not use `127.0.0.1` for a database hosted elsewhere. SQLite is only an explicitly selected local development option and is not used in MySQL mode.

Users and sessions are saved to MySQL `users` and `auth_sessions`. Study records use the existing `tasks` and `daily_notes` tables. Old records under `default` are not automatically reassigned to a new account.

## Verification performed

- `npm test`: registration, duplicate emails, password checks, persisted sessions, logout, task ownership, note isolation and forged Google credentials.
- A mocked verified Google response tests account persistence and reuse; it does not replace a live OAuth login test.
- `npm run build` and browser checks for registration, login, logout and refresh session restoration.
- Tests passed against both isolated SQLite and a newly generated MySQL test database. The MySQL test database is removed after testing; existing app records are untouched.
- Run `npm run test:mysql` to repeat real MySQL tests using your `.env` connection settings. The account needs permission to create and drop the generated test database.
- The real Google button loaded, but Google rejected `http://localhost:3000` because that origin has not been authorized for the configured OAuth client. Add that exact origin in Google Cloud before the live Google login test.

The in-process sign-in attempt limiter is useful for a single Node server; multi-instance hosting should also apply a shared rate limit at the gateway.
