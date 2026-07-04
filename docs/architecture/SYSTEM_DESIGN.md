# Frontend System Design

Dwelve frontend is a Next.js App Router application for a digital academic
testing and performance-management platform. It serves public landing pages,
authentication flows, and authenticated school dashboards.

## Application Areas

```txt
src/app/(landing)          public marketing site
src/app/(authentication)   login, signup, password reset, session actions
src/app/(root)             authenticated app shell and dashboard pages
```

## Frontend Responsibilities

- Render trilingual UI in English, Russian, and Uzbek Latin.
- Keep auth sessions in encrypted httpOnly cookies.
- Route unauthenticated users away from protected pages.
- Use server-side backend requests for private API calls.
- Validate backend payloads before UI code depends on them.
- Keep app-shell data such as notification counts synchronized with React Query.
- Treat the NestJS backend as the source of truth for auth, permissions,
  ownership, memberships, notifications, and school-scoped data.

## Backend Boundary

The local backend is the NestJS project at:

```txt
D:\IT\projects\Dwelve\backend_nestJS
```

Local API base:

```txt
http://localhost:5000/api/v1
```

Frontend code must read it from:

```env
DWELVE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not use browser-visible API base variables for private authenticated calls.

## Request Flow

```txt
Client component
-> React Query hook
-> next-safe-action server action
-> named endpoint function
-> authedBackendJson or backendJson
-> NestJS API
```

For read-only server-rendered data, server components may call server-only
helpers directly, but those helpers must still use the same endpoint/request
stack.

## State Ownership

| State | Owner |
|---|---|
| Auth identity and school context | encrypted session cookie |
| Backend records and permissions | NestJS backend |
| Client request cache | React Query |
| Form draft state | react-hook-form |
| UI theme | next-themes |
| Language selection | i18next plus local storage |

## Validation Boundary

Backend JSON is untrusted until parsed through a Zod response schema. TypeScript
types alone are not enough for API responses.
