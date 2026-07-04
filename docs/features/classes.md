# Classes

Classes are school-scoped academic groups. The backend must remain the source of
truth for class ownership, membership, teachers, and students.

## Frontend Status

Class/group UI is under active development in:

```txt
src/app/(root)/(pages)/groups/
```

When real class API wiring is added, it must follow the frontend request
architecture:

```txt
named endpoint function
-> authedBackendJson
-> Zod response schema
-> server action or server helper
-> React Query hook for client state
```

## Backend Routes

```txt
GET    /classes
GET    /classes/:classId
POST   /classes
PATCH  /classes/:classId
DELETE /classes/:classId
POST   /classes/:classId/students
DELETE /classes/:classId/students/:studentId
POST   /classes/:classId/teachers
DELETE /classes/:classId/teachers/:teacherId
```

## Frontend Rules

- Do not send `userId` to bypass backend ownership.
- Use selected school context from the session/backend.
- Hide admin-only class mutation controls for non-admin members.
- Still rely on the backend to enforce permissions.
- Add all visible copy to `en`, `ru`, and `uz` catalogs.
- Validate all backend class responses with Zod before rendering.

## Related Docs

```txt
docs/architecture/RBAC.md
docs/api/API_ROUTES.md
```
