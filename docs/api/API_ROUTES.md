# Frontend API Contracts

The frontend talks to the NestJS backend through server-side request helpers.

Backend base:

```txt
http://localhost:5000/api/v1
```

Frontend env:

```env
DWELVE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not use `NEXT_PUBLIC_API_URL` for private API calls.

## Request Implementation Rule

Every frontend backend call should follow:

```txt
named endpoint/action function
-> backendJson or authedBackendJson
-> Zod response schema
```

Client components and hooks call server actions or server helpers. They do not
call the backend URL directly.

## Auth

```txt
POST /auth/signup
POST /auth/login
POST /auth/google
POST /auth/refresh
POST /auth/logout
POST /auth/select-school
GET  /auth/me
GET  /auth/me/schools
```

Frontend implementation:

```txt
src/app/(authentication)/_lib/api.ts
src/app/(authentication)/_lib/actions.ts
src/app/(authentication)/_lib/api.schemas.ts
```

Signup creates only a normal global user account. It must not send role fields.

## Schools

All school routes require authentication.

```txt
POST /schools
GET  /schools
GET  /schools/:schoolId
PATCH /schools/:schoolId
GET  /schools/:schoolId/members
POST /schools/join
POST /schools/invites/teacher/accept
POST /schools/:schoolId/invites/teacher
```

Frontend implementation:

```txt
createSchoolAction -> createSchoolRequest -> authedBackendJson
joinSchoolAction   -> joinSchoolRequest   -> authedBackendJson
getSchool          -> getSchoolRequest    -> authedBackendJson
```

`PATCH /schools/:schoolId` updates admin-only school profile fields. It does not
update `isActive`. `GET /schools/:schoolId/members` returns member counts to any
active school member and full roster rows only to admins.

## Notifications

Notification routes require authentication.

```txt
GET    /notifications/status
GET    /notifications?tab=all|unread&page=1&limit=10
PATCH  /notifications/read-all
PATCH  /notifications/:notificationId/read
POST   /notifications/:notificationId/invitation
DELETE /notifications/:notificationId
```

Frontend implementation:

```txt
src/app/(root)/_lib/notification-actions.ts
src/app/(root)/_hooks/useNotifications.ts
src/app/(root)/_types/notification.schemas.ts
```

## Classes

Planned and partially represented in UI. Backend routes:

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

When frontend class requests are wired, add named endpoint functions and Zod
response schemas before UI code consumes those responses.
