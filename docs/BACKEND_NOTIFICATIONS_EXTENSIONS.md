# Backend Notifications — Required Extensions

This document specifies the backend work needed to fully support the redesigned
notifications page. It extends `FRONTEND_NOTIFICATIONS.md`; everything in that
document (status, list, per-item read, delete, greeting notifications) still
applies unchanged.

The notifications page now adds three capabilities the current API does not
cover:

1. **Category tabs** — `System`, `Payments`, `Invitations`.
2. **Mark all as read** — one action to clear every unread item.
3. **Invitation actions** — inline `Accept` / `Decline` on invitation items.

Until the backend ships these, the frontend degrades gracefully (see
[Interim frontend behavior](#interim-frontend-behavior)). The endpoints below
are the target contract.

All routes keep the existing conventions:

```txt
Base:    http://localhost:5000/api/v1
Auth:    Authorization: Bearer <accessToken>
Owner:   the backend derives the user from the JWT and filters by it
```

The frontend never sends `userId`.

---

## 1. Notification categories

Categories group notifications into the `System` / `Payments` / `Invitations`
tabs. The frontend currently derives the category on the client from the
notification `type` string; the backend should make this authoritative.

### Type → category taxonomy

| Category | Matches (case-insensitive substring on `type`) | Example types |
|---|---|---|
| `invitations` | `invit`, `join_request` | `GROUP_INVITE`, `CLASS_INVITATION`, `TEACHER_INVITE` |
| `payments` | `payment`, `billing`, `fee`, `invoice`, `subscription` | `PAYMENT_RECEIVED`, `INVOICE_DUE` |
| `system` | everything else (default) | `LOGIN_GREETING`, `ASSIGNMENT_POSTED`, `GRADE_POSTED`, `SCHEDULE_CHANGE` |

Recommended: store an explicit `category` column on each notification so the
mapping is owned by the backend rather than inferred from strings.

### Preferred: server-side filtering

Add an optional `category` query param to the existing list endpoint:

```txt
GET /api/v1/notifications?category=invitations&page=1&limit=10
GET /api/v1/notifications?category=payments&tab=unread&page=1&limit=10
```

| Param | Values | Default | Purpose |
|---|---|---|---|
| `category` | `system`, `payments`, `invitations` | (all categories) | Filters by category. |

`category` composes with the existing `tab` (`all` / `unread`) and pagination.
When `category` is omitted, behavior is unchanged.

Why this matters: the frontend currently filters the loaded pages client-side,
so a category can appear empty until the user loads more. Server-side filtering
makes counts and pagination correct.

---

## 2. Mark all as read

Clears every unread notification for the current user in one call.

```txt
PATCH /api/v1/notifications/read-all
```

Request body: none.

Response:

```json
{
  "updated": 4,
  "unreadCount": 0
}
```

Behavior:

- Sets `readAt` on every currently-unread notification owned by the user.
- Idempotent — calling it with nothing unread returns `"updated": 0`.
- After it succeeds the frontend invalidates status + lists.

---

## 3. Invitation actions (Accept / Decline)

Invitation-type notifications (`category = invitations`) render inline
`Accept` / `Decline` buttons. Responding resolves the underlying invitation and
marks the notification read.

```txt
POST /api/v1/notifications/:notificationId/invitation
```

Request body:

```json
{ "response": "accept" }
```

`response` is `"accept"` or `"decline"`.

Response:

```json
{
  "notification": {
    "id": "notification_id",
    "readAt": "2026-07-04T10:00:00.000Z",
    "data": {
      "invitationId": "invite_id",
      "status": "accepted"
    }
  }
}
```

Behavior:

- `accept` performs the side effect (e.g. creates the class/group membership),
  sets `data.status = "accepted"`, and marks the notification read.
- `decline` sets `data.status = "declined"` and marks the notification read.
- Re-responding to an already-resolved invitation returns `409` (or the current
  resolved state); the frontend hides the buttons once `status` is set.
- Authorization: the invitation must belong to the requesting user.

### Invitation `data` payload

Invitation notifications must include a structured `data` object so the frontend
can render context and resolve the invite:

```ts
type NotificationInvitationData = {
  invitationId: string;
  status: "pending" | "accepted" | "declined";
  // optional display context
  groupName?: string;
  inviterName?: string;
  memberCount?: number;
};
```

The frontend shows `Accept` / `Decline` only while `status` is absent or
`"pending"`.

---

## 4. Security notes

Unchanged from `FRONTEND_NOTIFICATIONS.md`, and additionally:

- `read-all` and the invitation endpoint must filter strictly by the JWT user;
  never accept a `userId`.
- The invitation endpoint must re-check that the invitation is addressed to the
  current user before performing any side effect — a notification id from
  another user's context must `404`.
- Do not trust `data.status` from the client; it is display-only. The backend
  owns invitation resolution state.

---

## Interim frontend behavior

Until these endpoints exist, the frontend keeps working:

| Feature | Interim behavior | File |
|---|---|---|
| Category tabs | Filter the loaded `tab=all` pages client-side by `type`. | `src/app/(root)/(pages)/notifications/_lib/notifications.ts` |
| Mark all as read | Tries `PATCH /notifications/read-all`; on failure falls back to per-item `PATCH /notifications/:id/read` over the known unread ids. | `src/app/(root)/_lib/notification-actions.ts` |
| Accept / Decline | Tries `POST /notifications/:id/invitation`; on failure falls back to marking the item read so the card still resolves. | `src/app/(root)/_lib/notification-actions.ts` |

Once the endpoints ship, remove the fallbacks so backend errors surface normally
and category counts/pagination become server-accurate.

---

## Manual QA additions

In addition to the checklist in `FRONTEND_NOTIFICATIONS.md`:

- `System` / `Payments` / `Invitations` tabs show only matching notifications.
- `Mark all as read` clears the bell dot, the sidebar badge, and the Unread tab.
- Accepting an invitation performs its side effect and removes the buttons.
- Declining an invitation resolves the card and removes the buttons.
- A resolved invitation no longer shows `Accept` / `Decline` after refetch.
- Responding to another user's invitation id is rejected by the backend.
