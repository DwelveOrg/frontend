# School Membership Flow

Dwelve uses a multi-school membership model. A user does not sign up as an
admin, teacher, or student. A user signs up as a normal account, then gains a
role through a school membership.

## Core Rule

Do not add role selection to signup.

Correct flow:

```txt
Signup or login
-> User has no memberships
-> User creates a school or joins through a credential
-> Backend creates SchoolMember
-> Backend returns school-aware tokens
-> Frontend rewrites the encrypted session
-> Frontend redirects to dashboard
```

Wrong flow:

```txt
Signup as admin
Signup as teacher
Signup as student
Send role during signup
Store teacher/student/admin role directly on User
```

## School Creation

Frontend implementation must use:

```txt
createSchoolAction
-> createSchoolRequest
-> authedBackendJson
-> backendJson
-> POST /schools
```

Successful response includes:

```txt
school
membership
member
tokens
```

After success, replace the previous user-only tokens with `response.tokens` and
store the selected school context in the encrypted session.

## Join School

Student join codes are backend-owned. The frontend sends:

```json
{
  "code": "DWL-EXAMPLE"
}
```

The backend returns a `STUDENT` membership and fresh school-aware tokens.

## Admin Access

Creating a school grants `ADMIN` inside that school only. The user is not
globally an admin.

Admins can edit school profile fields through:

```txt
PATCH /schools/:schoolId
```

Editable fields are `name`, `description`, `country`, `city`, and `logoUrl`.
This endpoint does not update `isActive`.

School member counts and admin roster data are available through:

```txt
GET /schools/:schoolId/members
```

Counts are visible to active school members. Full roster rows are admin-only and
provide `teacherProfileId` / `studentProfileId` for class assignment requests.

## Related Files

```txt
src/app/(authentication)/_lib/actions.ts
src/app/(authentication)/_lib/api.ts
src/app/(authentication)/_lib/api.schemas.ts
src/app/(root)/(pages)/schools/new/
src/app/(root)/(pages)/dashboard/
```

See also:

```txt
docs/architecture/RBAC.md
docs/api/API_ROUTES.md
```
