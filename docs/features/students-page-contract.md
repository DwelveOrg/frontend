# Students Page Backend Contract

This is the backend handoff for frontend agents. Do not implement the Students
tab by changing backend assumptions from the frontend. Consume the endpoint
below and keep the permission model intact.

## School Page Students Tab

The School page can add a real `Students` tab next to `Classes`.

Use:

```txt
GET /students
```

The request must be authenticated and must use the currently selected school
session context. Do not send `schoolId` in the request body. Do not use direct
frontend `fetch`; follow the frontend request stack with an authenticated
backend helper and a Zod response schema.

## Permissions

`GET /students` is `ADMIN` only.

Frontend behavior should be:

- Admin: show the student roster returned by `GET /students`.
- Teacher/student: do not call `GET /students`; show a read-only or unavailable
  state if the tab is visible.

This preserves the backend's admin-only roster boundary.

## Response Fields

Each student item includes:

```txt
id / studentId
memberId
userId
fullName
email
role
studentCode
phone
classes[]
classCount
joinedAt
createdAt
updatedAt
```

`classes[]` contains active class assignments in the selected school:

```txt
assignmentId
classId
name
gradeLevel
isActive
```

## Empty State

If `students` is empty and `count` is `0`, the school has no active student
members yet. The frontend can keep using the existing student join-code flow for
admins to add students to the school.
