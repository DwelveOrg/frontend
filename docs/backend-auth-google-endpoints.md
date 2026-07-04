# Backend Auth Endpoints For Google Login

Backend base URL for local development:

```txt
http://localhost:5000/api/v1
```

Frontend implementation must follow `docs/architecture/ARCHITECTURE.md`: call
these endpoints through server-side endpoint functions, `backendJson`, safe
actions, and Zod response schemas. Do not add browser-side direct fetches or
authenticated `NEXT_PUBLIC_API_URL` usage.

The backend keeps account signup role-free. Google signup/login creates or authenticates a normal global user only. Workspace roles still come from workspace creation or invitation acceptance.

## Environment Required

Backend `.env` must include the Google OAuth web client ID:

```env
GOOGLE_CLIENT_ID="your-google-web-client-id.apps.googleusercontent.com"
```

The frontend must obtain a Google ID token from Google Identity Services and send it to the backend. In Google Identity Services, the returned field is usually named `credential`; it is a JWT ID token.

## Auth Endpoints

### POST /auth/signup

Creates a normal email/password account. Does not create any workspace role.

Request:

```json
{
  "fullName": "Abdulaziz Yusupaliev",
  "email": "abdulaziz@example.com",
  "password": "strong-password"
}
```

Success response:

```json
{
  "user": {
    "id": "user-id",
    "fullName": "Abdulaziz Yusupaliev",
    "email": "abdulaziz@example.com",
    "globalRole": "USER",
    "isActive": true,
    "createdAt": "2026-06-30T00:00:00.000Z",
    "updatedAt": "2026-06-30T00:00:00.000Z"
  }
}
```

### POST /auth/login

Logs in with email/password. `workspaceId` is optional. If the account has exactly one active workspace membership and no `workspaceId` is sent, the backend selects it automatically.

Request:

```json
{
  "email": "abdulaziz@example.com",
  "password": "strong-password",
  "workspaceId": "optional-workspace-id"
}
```

Alternative request using `identifier`:

```json
{
  "identifier": "abdulaziz@example.com",
  "password": "strong-password"
}
```

Success response shape:

```json
{
  "user": {
    "id": "user-id",
    "fullName": "Abdulaziz Yusupaliev",
    "email": "abdulaziz@example.com",
    "globalRole": "USER",
    "isActive": true,
    "createdAt": "2026-06-30T00:00:00.000Z",
    "updatedAt": "2026-06-30T00:00:00.000Z"
  },
  "workspace": {
    "id": "workspace-id",
    "name": "Dwelve Demo School",
    "slug": "dwelve-demo-school",
    "logoUrl": null,
    "phone": null,
    "address": null,
    "isActive": true,
    "createdAt": "2026-06-30T00:00:00.000Z",
    "updatedAt": "2026-06-30T00:00:00.000Z"
  },
  "member": {
    "id": "member-id",
    "userId": "user-id",
    "workspaceId": "workspace-id",
    "role": "OWNER",
    "isActive": true,
    "createdAt": "2026-06-30T00:00:00.000Z",
    "updatedAt": "2026-06-30T00:00:00.000Z"
  },
  "memberships": [],
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

If no workspace is selected, `workspace` and `member` may be omitted. Always use `memberships` to decide whether the user should choose a workspace, create a workspace, or accept an invitation.

### POST /auth/google

Signs up or logs in with Google. This endpoint verifies the Google ID token on the backend using `GOOGLE_CLIENT_ID`.

Use this endpoint for both "Continue with Google" on signup and login screens.

Request with backend-friendly field name:

```json
{
  "idToken": "google-id-token-jwt",
  "workspaceId": "optional-workspace-id"
}
```

Request with Google Identity Services field name:

```json
{
  "credential": "google-id-token-jwt"
}
```

Success response:

```json
{
  "user": {
    "id": "user-id",
    "fullName": "Google Account Name",
    "email": "person@example.com",
    "globalRole": "USER",
    "isActive": true,
    "createdAt": "2026-06-30T00:00:00.000Z",
    "updatedAt": "2026-06-30T00:00:00.000Z"
  },
  "workspace": null,
  "member": null,
  "memberships": [],
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

Frontend behavior after success:

1. Store `tokens.accessToken` and `tokens.refreshToken` using the same session logic as password login.
2. If `memberships` is empty, send the user to create a workspace or accept an invitation.
3. If there is one selected `workspace` and `member`, enter that workspace context.
4. If there are multiple memberships and no selected workspace, show a workspace picker and call login again with `workspaceId`, or add a future backend endpoint for workspace token selection.

Important backend rules:

- The Google token must be an ID token, not a Google access token.
- Google email must be verified.
- If the user clicks Google signup/login after already using the same Google account, the backend logs them in automatically.
- Existing password users can link Google automatically when the emails match.
- If Google returns a changed verified email for the same linked Google account, the backend updates the email and logs in unless another Dwelve user already owns that email.
- Inactive users are rejected.
- Password login is not available for Google-only users unless a password setup flow is added later.
- Google signup does not create `OWNER`, `ADMIN`, `TEACHER`, or `STUDENT` roles.


Backend case matrix:

```txt
New verified Google email                 -> create normal USER and log in
Existing same googleId                    -> log in automatically
Existing password user with same email    -> link googleId and log in automatically
Existing inactive user                    -> reject
Same googleId with changed verified email -> update email and log in if the new email is not owned by another user
Email linked to another googleId          -> reject with conflict
```
Common errors:

```json
{ "statusCode": 400, "message": "Google ID token is required", "error": "Bad Request" }
```

```json
{ "statusCode": 401, "message": "Invalid Google token", "error": "Unauthorized" }
```

```json
{ "statusCode": 401, "message": "GOOGLE_CLIENT_ID is not configured", "error": "Unauthorized" }
```

```json
{ "statusCode": 409, "message": "Email is linked to another Google account", "error": "Conflict" }
```

### POST /auth/refresh

Rotates a refresh token and returns new tokens.

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response:

```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token"
}
```

### POST /auth/logout

Revokes a refresh token.

Request:

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

Response:

```json
{
  "success": true
}
```

### GET /auth/me

Requires:

```txt
Authorization: Bearer <accessToken>
```

Returns the current user and selected workspace/member if the token has workspace context.

### GET /auth/me/workspaces

Requires:

```txt
Authorization: Bearer <accessToken>
```

Returns all active workspace memberships for the current user.

## Related Workspace Endpoint

### POST /workspaces

Requires:

```txt
Authorization: Bearer <accessToken>
```

Creates a workspace and automatically creates an `OWNER` membership for the authenticated user.

Request:

```json
{
  "name": "Dwelve Demo School",
  "slug": "dwelve-demo-school",
  "phone": "+998901234567",
  "address": "Tashkent, Uzbekistan"
}
```

