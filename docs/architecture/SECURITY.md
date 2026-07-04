# Frontend Security

This document covers frontend security responsibilities. Backend authorization,
school isolation, and persistence rules live in the NestJS backend docs.

## Sessions

Frontend sessions use an encrypted httpOnly cookie.

Implementation files:

```txt
src/app/(authentication)/_lib/session.ts
src/app/(authentication)/_lib/session-token.ts
src/app/(authentication)/_constants/session.ts
```

Rules:

- `SESSION_SECRET` must come from the environment in production.
- Do not expose access or refresh tokens to client components.
- Do not store auth tokens in `localStorage`.
- Rotate the encrypted session after the backend returns fresh school-aware
  tokens.
- Treat auth/session changes as high-risk.

## Backend Requests

Private backend requests must stay server-side:

```txt
backendJson      -> unauthenticated server-side request helper
authedBackendJson -> authenticated server-side request helper
```

Rules:

- Use `DWELVE_API_BASE_URL`.
- Do not use `NEXT_PUBLIC_API_URL` for authenticated API calls.
- Do not manually duplicate bearer-token or refresh-token logic.
- Do not leak internal backend errors to the browser.
- Validate response bodies with Zod before UI code relies on them.

## User Input

- Forms must use `react-hook-form` plus Zod schemas.
- Never render raw HTML from backend strings or notification data.
- Keep URL fields restricted to safe web protocols when they may later render as
  image or link sources.
- Use translation keys for UI copy rather than user-provided strings.

## Environment And Secrets

Never commit:

- `.env`
- `.env.local`
- API secrets
- JWT/session secrets
- OAuth client secrets

`NEXT_PUBLIC_*` values are visible in the browser and must be treated as public.

## Error Handling

Server actions must return safe user-facing errors. Internal details, stack
traces, raw backend validation payloads, and config failures should be logged on
the server and masked from the client.
