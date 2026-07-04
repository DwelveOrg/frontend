# Frontend MVP Plan

This file mirrors the backend docs structure and tracks frontend MVP priorities.

## Current Priorities

1. Stable auth and encrypted session handling.
2. School creation and selected school context.
3. Dashboard shell and navigation.
4. Notifications status/list/read/delete flows.
5. Classes/groups surfaces wired to real backend contracts.
6. Assignment and exam workflows.
7. Trilingual UI coverage.

## Implementation Rules

- Follow `docs/architecture/ARCHITECTURE.md` for request, form, schema, and data
  fetching work.
- Follow `docs/design/design-system.md` for UI work.
- Keep auth/session changes high-risk and verify with `npm run lint` plus
  `npm run build`.
- When a feature depends on backend behavior, verify the matching NestJS
  controller/service/DTO in `D:\IT\projects\Dwelve\backend_nestJS`.

## Done Criteria For Feature Work

- UI copy is translated in English, Russian, and Uzbek Latin.
- Backend responses used by UI code are validated with Zod.
- Client mutations invalidate the right React Query keys.
- Protected flows degrade cleanly on expired sessions.
- `npm run lint` and `npm run build` pass.
