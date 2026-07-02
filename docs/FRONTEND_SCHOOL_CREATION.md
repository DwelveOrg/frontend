# Frontend School Creation Flow

This document explains how the frontend should implement school creation in Dwelve.

Dwelve uses a multi-school membership model. A user does not sign up as an admin,
teacher, or student. A user signs up as a normal account, then becomes an `ADMIN`
only inside a school after creating that school.

## Core Rule

Do not add role selection to signup.

Correct frontend flow:

```txt
Signup or login
-> User has a normal account
-> User creates a school
-> Backend creates the school
-> Backend creates SchoolMember with role ADMIN
-> Frontend stores the returned school-aware tokens
-> Frontend redirects to the new school dashboard
```

Wrong frontend flow:

```txt
Signup as admin
Signup as teacher
Signup as student
Send role during signup
Store teacher/student/admin role directly on User
```

School roles belong to `SchoolMember`, not `User`.

## API Base URL

The backend uses this global API prefix:

```txt
/api/v1
```

If the backend is running locally on port `5000`, the frontend API base URL is:

```txt
http://localhost:5000/api/v1
```

Recommended frontend environment variable:

```txt
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Authentication Requirement

School creation is protected by `JwtAuthGuard`.

The frontend must send the access token returned by login:

```http
Authorization: Bearer <accessToken>
```

The current backend reads JWTs from the `Authorization` header, not from cookies.

## Frontend Pages

Recommended pages for the school creation journey:

| Page | Purpose |
|---|---|
| `/signup` | Create a normal user account only. |
| `/login` | Log in and receive tokens. |
| `/schools` | Decide whether to create, join, switch, or enter a school. |
| `/schools/new` | Create School form. |
| `/schools/:schoolId/dashboard` | First page after successful school creation. |

## Step 1: Signup

Signup creates only the user account.

Endpoint:

```txt
POST /api/v1/auth/signup
```

Request:

```json
{
  "fullName": "Ali Karimov",
  "email": "ali@example.com",
  "password": "strong-password"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "fullName": "Ali Karimov",
    "email": "ali@example.com",
    "globalRole": "USER",
    "isActive": true,
    "createdAt": "2026-07-02T00:00:00.000Z",
    "updatedAt": "2026-07-02T00:00:00.000Z"
  }
}
```

Important frontend behavior:

1. Do not ask for school role during signup.
2. Do not send `role`, `schoolRole`, `schoolId`, or `memberId`.
3. After signup, send the user to login or automatically log them in if the frontend supports that.

## Step 2: Login

Endpoint:

```txt
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "ali@example.com",
  "password": "strong-password"
}
```

Response when the user has no school yet:

```json
{
  "user": {
    "id": "user_id",
    "fullName": "Ali Karimov",
    "email": "ali@example.com",
    "globalRole": "USER",
    "isActive": true
  },
  "memberships": [],
  "tokens": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

Frontend behavior:

1. Store the returned tokens according to the frontend auth strategy.
2. If there are no memberships, route to `/schools`.
3. From `/schools`, show a primary action to create a school.

## Step 3: Show School Onboarding

The frontend can call either endpoint to check the user's schools:

```txt
GET /api/v1/schools
GET /api/v1/auth/me/schools
```

For the dedicated school onboarding page, `GET /api/v1/schools` is the simplest.

Request:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "schools": []
}
```

Frontend decision:

```txt
0 schools
-> Show "Create School" and "Join School"

1 school
-> Redirect to /schools/:schoolId/dashboard

2 or more schools
-> Show a school switcher
```

## Step 4: Create School Form

Page:

```txt
/schools/new
```

Required field:

| Field | Required | Validation |
|---|---:|---|
| `name` | Yes | String, max 120 characters. |

Optional fields:

| Field | Required | Validation |
|---|---:|---|
| `description` | No | String, max 500 characters. |
| `country` | No | String, max 80 characters. |
| `city` | No | String, max 80 characters. |
| `logoUrl` | No | Full URL with protocol, max 500 characters. |

Example form state:

```ts
type CreateSchoolFormValues = {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  logoUrl?: string;
};
```

## Step 5: Submit School Creation

Endpoint:

```txt
POST /api/v1/schools
```

Request headers:

```http
Content-Type: application/json
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "name": "Dwelve Academy",
  "description": "Modern learning center",
  "country": "Uzbekistan",
  "city": "Tashkent",
  "logoUrl": "https://example.com/logo.png"
}
```

Successful response:

```json
{
  "school": {
    "id": "school_id",
    "name": "Dwelve Academy",
    "description": "Modern learning center",
    "country": "Uzbekistan",
    "city": "Tashkent",
    "logoUrl": "https://example.com/logo.png",
    "isActive": true,
    "studentJoinCode": "DWL-EXAMPLE",
    "createdAt": "2026-07-02T00:00:00.000Z",
    "updatedAt": "2026-07-02T00:00:00.000Z"
  },
  "membership": {
    "id": "member_id",
    "userId": "user_id",
    "schoolId": "school_id",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-07-02T00:00:00.000Z",
    "updatedAt": "2026-07-02T00:00:00.000Z"
  },
  "member": {
    "id": "member_id",
    "userId": "user_id",
    "schoolId": "school_id",
    "role": "ADMIN",
    "isActive": true
  },
  "tokens": {
    "accessToken": "school_aware_jwt_access_token",
    "refreshToken": "school_aware_jwt_refresh_token"
  }
}
```

Important frontend behavior:

1. Replace the previous tokens with `response.tokens`.
2. These new tokens include `schoolId`, `memberId`, and `schoolRole`.
3. Save the returned `school.id`.
4. Redirect to `/schools/${school.id}/dashboard`.

## Why Tokens Are Returned Again

Before school creation, the logged-in user may have a token that only identifies
the user:

```txt
sub
email
globalRole
```

After school creation, the backend returns new tokens with school context:

```txt
sub
email
globalRole
schoolId
memberId
schoolRole = ADMIN
```

The frontend should use the new token immediately after school creation so later
school-scoped requests have the correct context.

## Frontend API Helper Example

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateSchoolPayload = {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  logoUrl?: string;
};

export async function createSchool(
  payload: CreateSchoolPayload,
  accessToken: string,
) {
  const response = await fetch(`${API_URL}/schools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message ?? "Failed to create school",
    };
  }

  return data;
}
```

## Submit Handler Example

```ts
async function handleCreateSchool(values: CreateSchoolFormValues) {
  setIsSubmitting(true);
  setError(null);

  try {
    const result = await createSchool(values, auth.accessToken);

    auth.setTokens(result.tokens);
    auth.setCurrentSchool(result.school);
    auth.setCurrentMember(result.membership);

    router.push(`/schools/${result.school.id}/dashboard`);
  } catch (error) {
    setError(getSchoolCreationErrorMessage(error));
  } finally {
    setIsSubmitting(false);
  }
}
```

## Error Handling

Recommended frontend messages:

| Status | Likely reason | Frontend behavior |
|---:|---|---|
| `400` | Invalid form data. | Show field or form validation message. |
| `401` | Missing, invalid, or expired access token. | Send user to login. |
| `409` | Backend could not generate a unique join code after retries. | Ask user to try again. |
| `500` | Unexpected backend error. | Show generic error and allow retry. |

Example error mapper:

```ts
function getSchoolCreationErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = Number(error.status);

    if (status === 400) {
      return "Please check the school details and try again.";
    }

    if (status === 401) {
      return "Your session expired. Please log in again.";
    }

    if (status === 409) {
      return "We could not finish creating the school. Please try again.";
    }
  }

  return "Something went wrong while creating the school.";
}
```

## Loading And UX States

The create school page should handle these states:

| State | UI behavior |
|---|---|
| Initial | Empty form, submit button disabled until `name` is valid. |
| Submitting | Disable inputs and show loading state. |
| Success | Store new tokens and redirect to dashboard. |
| Validation error | Keep form values and show clear error text. |
| Unauthorized | Clear auth state and redirect to login. |
| Server error | Keep form values and allow retry. |

## Backend Behavior The Frontend Can Rely On

When `POST /api/v1/schools` succeeds, the backend:

1. Validates the authenticated user.
2. Generates a student join code.
3. Creates the `School`.
4. Creates a `SchoolMember` for the creator.
5. Assigns that member the `ADMIN` role.
6. Returns the created school, membership, and fresh tokens.

School creation and admin membership creation happen inside one database
transaction. If one fails, both fail.

## Dashboard After Creation

After redirecting to `/schools/:schoolId/dashboard`, the frontend should treat
the current user as `ADMIN` for that school.

Recommended first dashboard data fetch:

```txt
GET /api/v1/schools/:schoolId
```

Request:

```http
Authorization: Bearer <school-aware accessToken>
```

Response:

```json
{
  "school": {
    "id": "school_id",
    "name": "Dwelve Academy",
    "description": "Modern learning center",
    "country": "Uzbekistan",
    "city": "Tashkent",
    "logoUrl": "https://example.com/logo.png",
    "isActive": true,
    "studentJoinCode": "DWL-EXAMPLE"
  },
  "currentUserRole": "ADMIN",
  "membership": {
    "id": "member_id",
    "userId": "user_id",
    "schoolId": "school_id",
    "role": "ADMIN",
    "isActive": true
  }
}
```

The backend includes `studentJoinCode` for admins. This allows the new admin to
copy the student join code from the dashboard.

## Frontend Checklist

Use this checklist when implementing the flow:

- Signup form has `fullName`, `email`, and `password` only.
- Signup form does not contain role selection.
- Login stores `accessToken` and `refreshToken`.
- `/schools` checks memberships after login.
- `/schools/new` requires an authenticated user.
- Create School form validates `name` before submit.
- Create School request sends `Authorization: Bearer <accessToken>`.
- After success, frontend replaces old tokens with returned `tokens`.
- After success, frontend stores current school and membership.
- After success, frontend redirects to `/schools/:schoolId/dashboard`.
- Dashboard checks `currentUserRole` from backend response.
- Frontend hides admin-only UI for non-admin members.
- Backend remains the source of truth for permissions.

## Final Mental Model

Think of school creation as creating two records:

```txt
School
SchoolMember(userId, schoolId, role = ADMIN)
```

The user is not globally an admin. The user is only an admin inside the school
they created.
