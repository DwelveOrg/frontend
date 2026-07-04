# Frontend Persistence

The frontend does not own the product database. The NestJS backend and Prisma
schema are the source of truth for users, schools, memberships, classes,
notifications, exams, and results.

Backend database docs live in:

```txt
D:\IT\projects\Dwelve\backend_nestJS\docs\architecture\DATABASE.md
```

## Frontend-Owned Persistence

The frontend may persist only UI/session concerns:

| Data | Storage |
|---|---|
| Auth/session payload | encrypted httpOnly cookie |
| Theme preference | `next-themes` storage |
| Language preference | configured i18n local storage key |
| React Query cache | in-memory browser cache |

## Rules

- Do not store backend records as long-lived local source of truth.
- Do not store access tokens or refresh tokens in `localStorage`.
- Do not invent client-only IDs for backend-owned entities.
- Do not rely on cached client data for authorization.
- Refetch or invalidate React Query data after membership-changing mutations.

## Backend Data Contracts

When UI code depends on backend data, define a Zod response schema and parse the
response at the request boundary. This is the frontend equivalent of database
contract enforcement.
