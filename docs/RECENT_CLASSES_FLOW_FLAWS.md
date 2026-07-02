# Recent Classes Flow Flaws And Risks

This document records the flaws, limitations, and open risks from the recent
school/classes flow changes.

## Context

Recent changes added:

- A `ClassesModule`.
- Class CRUD endpoints.
- Teacher and student assignment endpoints.
- Frontend flow documentation for the Classes page.
- `POST /api/v1/auth/select-school` for switching a JWT into school context.

The intended product flow is:

```txt
Signup or login
-> Create or select a school
-> Receive school-aware tokens
-> Create and manage classes inside that school
```

## Flaws And Open Issues

### 1. No Real Frontend Exists In This Repository

The requested behavior is frontend behavior, but this repository currently only
contains the NestJS backend.

The backend now supports the needed class APIs, and the docs explain the
frontend flow, but no actual frontend button, redirect, page, or form was
implemented here.

Risk:

```txt
The documented flow can still be implemented incorrectly on the frontend.
```

### 2. Create Class Still Requires School Context

`POST /api/v1/classes` requires a school-aware JWT.

If the frontend calls it with a normal login token that does not include
`schoolId`, the backend returns a forbidden error.

Mitigation added:

```txt
POST /api/v1/auth/select-school
```

Remaining risk:

```txt
The frontend must remember to call select-school or store fresh tokens after
school creation.
```

### 3. "Create Class" Cannot Actually Auto-Create A School By Itself

The backend does not make `POST /api/v1/classes` create a school automatically.

Correct behavior is a frontend redirect:

```txt
User clicks Create Class with no school
-> redirect to Create School
-> create school
-> store returned tokens
-> continue to class creation
```

Risk:

```txt
If the frontend expects one API call to create both school and class, that API
does not exist yet.
```

### 4. No Public Join Class Feature Exists

The current backend does not support a class join code or invite link.

Current v1 behavior:

```txt
Admin assigns existing student profiles to classes.
```

Risk:

```txt
A frontend "Join Class" button would be misleading unless a class join-code
feature is built.
```

### 5. No Students Or Teachers Listing API Was Added

Class assignment endpoints require:

```txt
studentProfileId
teacherProfileId
```

But this change did not add endpoints for listing available students or teachers
inside the school.

Risk:

```txt
The frontend may not have an easy way to populate "Assign Student" or
"Assign Teacher" dropdowns yet.
```

### 6. Class List Returns Full Rosters

`GET /api/v1/classes` returns assigned teachers and students with names and
emails.

Risk:

```txt
Teachers and students may see more roster information than the product wants.
```

This should be confirmed before production. The backend may need different
response shapes by role.

### 7. No Pagination Or Search

The class list endpoint currently returns all visible active classes.

Risk:

```txt
Large schools may eventually need pagination, search, and filtering.
```

### 8. Delete Is Actually Soft Delete

`DELETE /api/v1/classes/:classId` sets:

```txt
isActive = false
```

It does not physically delete the class.

Risk:

```txt
The frontend should label this as archive/deactivate if hard delete is not the
intended product behavior.
```

### 9. Assignment Responses Are Minimal

Adding a student or teacher returns the raw assignment record:

```txt
classStudent
classTeacher
```

It does not return the fully refreshed class.

Risk:

```txt
The frontend may need to refetch the class after assignment.
```

### 10. No Automated Tests Were Added

The changes were verified with:

```txt
npm run typecheck
npm run build
npm run lint
```

But no unit or e2e tests were added.

Risk:

```txt
School isolation, role permissions, and class assignment behavior are not
covered by automated tests yet.
```

### 11. Select School Issues New Refresh Tokens

Every call to `POST /api/v1/auth/select-school` issues a new refresh token.

Risk:

```txt
If the frontend calls this too often, many refresh tokens can accumulate.
```

Possible future improvement:

```txt
Revoke the previous refresh token during school switching, or add token rotation
rules for this endpoint.
```

### 12. Multiple-School UX Still Needs Frontend Discipline

The backend can select a school, but the frontend must own the UX:

```txt
Multiple schools
-> show school switcher
-> call select-school
-> store returned tokens
-> load classes
```

Risk:

```txt
If the frontend silently chooses the wrong school, class data will load for the
wrong context.
```

## Recommended Next Fixes

1. Add teacher and student listing endpoints for class assignment screens.
2. Add class flow e2e tests.
3. Decide whether "Join Class" means admin assignment or student self-join code.
4. If self-join is needed, add a secure class join-code model and endpoint.
5. Decide whether class delete should be called delete, archive, or deactivate.
6. Decide whether students should see classmate emails in class roster responses.
7. Add pagination and search to `GET /api/v1/classes`.

## Final Note

The current backend supports safe class creation after school creation, but the
frontend must still implement the redirect and token-replacement flow carefully.
