# Frontend Notifications Flow

This document explains how the Dwelve frontend should implement notifications.
It is written for frontend agents and developers working in the Next.js app.

Notifications are user-scoped. They are not school roles, and they must not be
used to decide permissions. The backend is the source of truth for notification
existence, unread state, pagination, and ownership.

## Core Behavior

The frontend has two notification surfaces:

```txt
Navbar bell icon
-> asks the backend if unread notifications exist
-> shows a red indicator / count
-> does not fetch the full list until opened

Notifications page
-> fetches a limited page of notifications
-> supports All and Unread tabs
-> groups messages by date
-> loads more only when the user asks
```

When a user opens or clicks a notification:

```txt
User clicks notification
-> frontend marks it read optimistically
-> frontend sends PATCH request to backend
-> notification disappears from Unread
-> notification remains visible in All
```

## Backend API Base

Backend routes use the global prefix:

```txt
/api/v1
```

Local backend base URL:

```txt
http://localhost:5000/api/v1
```

The current frontend should call the backend through existing authenticated
helpers, especially:

```txt
authedBackendJson
```

This helper sends the access token and refreshes it once if needed.

## Authentication

All notification endpoints are protected.

Every request must include:

```http
Authorization: Bearer <accessToken>
```

The frontend should not pass `userId` in notification requests. The backend
derives the current user from the JWT and filters all notification queries by
that user.

## Notification Data Shape

Frontend notification item:

```ts
type NotificationItem = {
  id: string;
  schoolId?: string | null;
  type: string;
  titleKey: string;
  bodyKey: string;
  data?: unknown;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  unread: boolean;
};
```

Important fields:

| Field | Purpose |
|---|---|
| `id` | Used for read/delete actions. |
| `titleKey` | i18n key for the title. |
| `bodyKey` | i18n key for the body/description. |
| `createdAt` | Used for sorting, relative time, and date grouping. |
| `readAt` | `null` means unread. |
| `unread` | UI convenience value from backend/client mapping. |

Do not hard-code notification text in components. Render with:

```tsx
t(item.titleKey)
t(item.bodyKey)
```

## Endpoints

### Check Notification Status

Used by the navbar bell and sidebar badge.

```txt
GET /api/v1/notifications/status
```

Response:

```json
{
  "hasUnread": true,
  "unreadCount": 3
}
```

Frontend behavior:

- Call this lightweight endpoint when the authenticated app shell loads.
- Refetch after route changes or after marking/deleting notifications.
- Use `hasUnread` to show the bell dot.
- Use `unreadCount` for sidebar/mobile count badges when space allows.
- Do not fetch the full notification list just to decide whether the bell is active.

### List Notifications

Used by the dropdown and full notifications page.

```txt
GET /api/v1/notifications?tab=all&page=1&limit=10
GET /api/v1/notifications?tab=unread&page=1&limit=10
```

Query params:

| Param | Values | Default | Purpose |
|---|---|---|---|
| `tab` | `all`, `unread` | `all` | Which notifications to return. |
| `page` | number >= 1 | `1` | Page number. |
| `limit` | 1 to 50 | `10` | Number of messages per page. |

Response:

```json
{
  "data": [
    {
      "id": "notification_id",
      "userId": "user_id",
      "schoolId": null,
      "type": "LOGIN_GREETING",
      "titleKey": "root.notifications.items.loginGreeting.title",
      "bodyKey": "root.notifications.items.loginGreeting.description",
      "data": null,
      "readAt": null,
      "createdAt": "2026-07-02T08:30:00.000Z",
      "updatedAt": "2026-07-02T08:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasMore": true,
    "unreadCount": 3
  }
}
```

Frontend behavior:

- The dropdown should request `tab=unread&limit=5`.
- The notifications page should request `limit=10` by default.
- Use infinite query or equivalent pagination state.
- Show a `Load more` button only when `meta.hasMore` is true.
- Do not request page 2 until the user clicks `Load more`.

### Mark Notification As Read

Used when the user opens/clicks a notification.

```txt
PATCH /api/v1/notifications/:notificationId/read
```

Response:

```json
{
  "notification": {
    "id": "notification_id",
    "readAt": "2026-07-02T08:35:00.000Z"
  }
}
```

Frontend behavior:

- Optimistically set `unread = false`.
- Invalidate/refetch notification status.
- Invalidate/refetch notification lists.
- If currently on the Unread tab, remove the item from visible unread results.
- If the request fails, restore unread state and keep the user on the same page.

### Delete Notification

Used by the trash button.

```txt
DELETE /api/v1/notifications/:notificationId
```

Response:

```json
{
  "success": true
}
```

Frontend behavior:

- Optimistically remove the item from the current list.
- Invalidate/refetch notification status and lists.
- If the request fails, restore the item.
- Deleting is soft delete on the backend.

## Required React Query Keys

Use stable keys so navbar, sidebar, dropdown, and page stay in sync.

Recommended shape:

```ts
export const queryKeys = {
  notifications: {
    all: ["notifications"] as const,
    status: () => ["notifications", "status"] as const,
    list: (tab: "all" | "unread", limit: number) =>
      ["notifications", "list", tab, limit] as const,
  },
};
```

After read/delete mutations, invalidate:

```ts
queryKeys.notifications.status()
queryKeys.notifications.all
```

## App Shell Behavior

The authenticated root layout includes the navbar and sidebar.

Recommended app-shell flow:

```txt
Root app shell mounts
-> useNotificationStatus()
-> render bell/sidebar badge

Route changes
-> refetch status

Notification read/delete succeeds
-> invalidate status
-> badge updates
```

The app shell should not load the full notifications page data.

## Navbar Dropdown Behavior

The dropdown is intentionally lightweight.

Flow:

```txt
User clicks bell
-> dropdown opens
-> fetch unread notifications with limit 5
-> show skeleton while loading
-> show unread notification cards
-> show empty state if none
```

When the user clicks an item in the dropdown:

```txt
Click item
-> call mark-read mutation
-> close dropdown
-> navigate to /notifications
```

The dropdown should not implement full pagination. Use the notifications page
for full history and `Load more`.

## Notifications Page Behavior

The page should include:

- `All` tab.
- `Unread` tab.
- Limited initial fetch.
- `Load more` button.
- Date-separated sections.
- Empty state.
- Error state.
- Loading skeleton.
- Details dialog or expanded card view.

Recommended flow:

```txt
Open /notifications
-> default tab = All
-> fetch page 1 with limit 10
-> group by date
-> render sections

Switch to Unread
-> fetch unread page 1
-> show only unread items

Click Load more
-> fetch next page
-> append to current tab
```

## Date Grouping

Messages must be separated by date.

Required labels:

```txt
Today
Yesterday
Localized full date for older days
```

Example:

```txt
Today
  Welcome back
  New result added

Yesterday
  Welcome back

June 29, 2026
  Policy update
```

Implementation guidance:

- Use `createdAt` for grouping.
- Compare by local calendar day.
- Use `Intl.DateTimeFormat(i18n.language, ...)` for older dates.
- Translate Today and Yesterday through i18n keys.

## Tabs

Tabs are frontend query filters:

```txt
All    -> GET /notifications?tab=all
Unread -> GET /notifications?tab=unread
```

Important behavior:

- A read notification remains in All.
- A read notification disappears from Unread.
- Switching tabs should not lose cached data unnecessarily.
- If Unread becomes empty after marking the last item read, show the empty state.

## Greeting Notifications

The backend creates greeting notifications automatically.

Cases:

| Event | Notification |
|---|---|
| Password signup | Signup greeting. |
| Password login | Login greeting. |
| New Google account | Signup greeting. |
| Existing Google account login | Login greeting. |

Frontend rule:

```txt
Do not manually create greeting notifications.
```

Important signup rule:

The backend signup response includes auth tokens. The frontend should create the
session from the signup response directly. Do not call login immediately after
signup, because that would create an extra login greeting.

## i18n Keys

Required notification page keys:

```txt
root.notifications.tabs.all
root.notifications.tabs.unread
root.notifications.dateGroups.today
root.notifications.dateGroups.yesterday
root.notifications.loading
root.notifications.loadMore
root.notifications.errorTitle
root.notifications.errorDescription
root.notifications.emptyTitle
root.notifications.emptyDescription
root.notifications.delete
root.notifications.close
```

Required greeting keys:

```txt
root.notifications.items.signupGreeting.title
root.notifications.items.signupGreeting.description
root.notifications.items.loginGreeting.title
root.notifications.items.loginGreeting.description
```

All user-facing strings must be added to:

```txt
src/i18n/messages/en.ts
src/i18n/messages/ru.ts
src/i18n/messages/uz.ts
```

## Loading, Empty, And Error States

### Navbar Status

If status fails:

- Do not crash the app shell.
- Hide the badge or show zero.
- Let future refetches recover.

### Dropdown

Loading:

- Show a compact skeleton.

Empty:

- Show "No notifications" copy.

Error:

- Show compact error text.
- Do not keep the dropdown spinner forever.

### Notifications Page

Loading:

- Show list skeletons.

Empty:

- Show the shared `Empty` component.

Error:

- Show retry-friendly error text.

## Optimistic Updates

Use optimistic updates for a responsive UI.

Mark read:

```txt
Before request
-> unread false locally
-> remove from Unread view

On success
-> invalidate status and lists

On failure
-> restore unread locally
```

Delete:

```txt
Before request
-> remove item locally

On success
-> invalidate status and lists

On failure
-> restore item locally
```

Avoid changing backend-owned timestamps permanently on the client. Temporary
optimistic timestamps are okay for UI state, but refetch backend data afterward.

## Security And Ownership

The frontend must not:

- Send `userId` in notification list/read/delete requests.
- Trust notification IDs from another user's context.
- Use notifications to decide RBAC permissions.
- Expose backend errors with sensitive details.
- Render raw HTML from notification data.

The backend filters every notification by authenticated user. The frontend
should still treat notifications as private account data.

## Recommended File Organization

Shared notification API/actions:

```txt
src/app/(root)/_lib/notification-actions.ts
```

Shared notification hooks:

```txt
src/app/(root)/_hooks/useNotifications.ts
```

Shared notification types:

```txt
src/app/(root)/_types/index.ts
```

Navbar dropdown:

```txt
src/app/(root)/_components/Navbar/_components/Notifications/index.tsx
```

Full page:

```txt
src/app/(root)/(pages)/(small-container)/notifications/page.tsx
```

Page-local components:

```txt
src/app/(root)/(pages)/(small-container)/notifications/_components/
```

## Manual QA Checklist

Use this checklist after implementing or modifying notifications:

- Fresh signup creates one unread welcome notification.
- Signup does not also create an immediate login greeting.
- Login creates an unread greeting.
- Bell badge appears after unread notification exists.
- Bell status request is lightweight and does not fetch full list.
- Opening dropdown fetches unread notifications.
- Dropdown empty state appears when no unread notifications exist.
- Clicking dropdown item marks it read and routes to `/notifications`.
- `/notifications` defaults to All.
- All tab shows read and unread notifications.
- Unread tab shows only unread notifications.
- Clicking unread item removes it from Unread.
- Clicking unread item keeps it visible in All.
- Notifications are grouped by Today, Yesterday, and older date.
- Load more appears only when more pages exist.
- Delete removes a notification from the UI.
- Failed read/delete request restores optimistic UI.
- EN/RU/UZ translations render without missing keys.
- Mobile sidebar badge and desktop navbar badge update after read/delete.

## Validation Commands

Frontend:

```txt
npm run lint
npm run build
```

Backend should also pass because the UI depends on backend contracts:

```txt
npm run typecheck
npm run build
```

## Final Mental Model

Think of notifications as an account inbox:

```txt
Status request -> "Should I light up the bell?"
List request   -> "Show me a small page of messages."
Read request   -> "This message was opened."
Delete request -> "Hide this message from my inbox."
```

The frontend controls presentation and optimistic UX. The backend controls
ownership, unread state, pagination, and persistence.
