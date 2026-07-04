# Frontend RBAC

The backend owns all permissions. The frontend may hide, disable, or redirect UI
based on session and backend response data, but it must never be the final
permission authority.

## Role Model

Dwelve uses global user accounts plus school memberships:

```txt
User
School
SchoolMember(userId, schoolId, role)
```

School roles belong to `SchoolMember`, not `User`.

Supported school roles:

```txt
ADMIN
TEACHER
STUDENT
```

The frontend may still tolerate legacy role literals in old data contracts, but
new code must align with the NestJS backend roles above.

## Frontend Rules

- Do not add role selection to signup.
- Do not store teacher/student/admin as a global user role.
- Do not send `role`, `schoolRole`, `schoolId`, or `memberId` during signup.
- Do not let users self-declare teacher access.
- Show admin UI only when the selected membership role is `ADMIN`.
- Treat backend responses as authoritative for current role and membership.
- Re-check backend data after membership-changing actions such as creating or
  joining a school.

## Authenticated Route Behavior

Protected routes live under `src/app/(root)`. Route protection runs through
`src/proxy.ts`.

Server-side current user data is read through:

```txt
src/app/(root)/_utils/getUser.ts
```

School detail and current role are fetched from the backend with:

```txt
GET /schools/:schoolId
```

The dashboard must use `currentUserRole` from that backend response for
admin-only surfaces such as student join codes.

## Security Boundary

Hiding a button is not authorization. Every protected backend action must still
be authorized by the NestJS API using JWT, school membership, and role guards.
