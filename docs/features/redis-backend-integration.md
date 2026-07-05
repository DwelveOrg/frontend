# Redis Backend Integration Notes

The NestJS backend now uses Redis for temporary auth and security state. Redis is
backend infrastructure only; the frontend must not connect to Redis directly.

## What Changed In The Backend

- Refresh sessions are stored in Redis instead of new `RefreshToken` database rows.
- `POST /auth/refresh` rotates refresh tokens. A refresh token can be used once.
- `POST /auth/logout` deletes the current Redis refresh session.
- `POST /auth/logout-all` was added for deleting all refresh sessions for the
  signed-in user.
- Sensitive auth and school onboarding routes can now return HTTP `429`.
- `GET /health` was added and reports API, PostgreSQL, and Redis status.

## Frontend Changes To Make

- Keep using `DWELVE_API_BASE_URL=http://localhost:5000/api/v1`. Do not add
  Redis env vars to the frontend.
- Keep using `refreshTokensRequest` and `authedBackendJson`; they already match
  the rotated refresh-token contract because they save the new `refreshToken`
  returned by `/auth/refresh`.
- Add `logoutAllRequest` in `src/app/(authentication)/_lib/api.ts`:
  `POST /auth/logout-all`, called through `authedBackendJson`.
- Create a server action for logout from all devices near the existing
  `logout()` action. It should call `logoutAllRequest`, then `deleteSession()`,
  then redirect to login.
- Add a UI entry point for logout from all devices in the settings/security
  area, most likely under
  `src/app/(root)/(pages)/(small-container)/settings/_components/SecuritySection.tsx`.
- Treat backend `429` responses as user-safe messages in auth, join-school, and
  invite-teacher actions. Current `BackendApiError` handling already surfaces
  backend messages, but UI copy should make rate limiting feel intentional.
- Optionally add a server-side health request for admin/dev diagnostics:
  `GET /health`. Do not call health checks from normal user pages on every load.

## What Not To Change

- Do not install a Redis client in the frontend.
- Do not expose Redis URLs through `NEXT_PUBLIC_*`.
- Do not store refresh tokens in browser local storage. Keep the existing
  encrypted httpOnly session cookie flow.
- Do not change auth response schemas for login/signup/google/refresh; token
  response shape is still `{ accessToken, refreshToken }`.

## Local Development

Run Redis with the backend before testing auth flows:

```powershell
docker run --name dwelve-redis -p 6379:6379 redis:7-alpine
```

Then run the backend from `D:\IT\projects\Dwelve\backend_nestJS` and the
frontend from this repo:

```powershell
npm.cmd run dev
```

If Redis is not running, auth refresh/rate-limited flows may fail because those
sessions are no longer stored in PostgreSQL.
