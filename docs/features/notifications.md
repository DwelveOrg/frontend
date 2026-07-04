# Notifications Flow

Notifications are user-scoped. They are not school roles and must not decide
permissions. The backend owns notification existence, unread state, pagination,
and ownership.

## Core Behavior

```txt
App shell
-> fetch notification status
-> show navbar/sidebar badges

Notifications page
-> fetch paginated notifications
-> group messages by date
-> support All and Unread tabs
-> load more only when requested
```

## Request Rules

Notification requests must follow `docs/architecture/ARCHITECTURE.md`:

```txt
React Query hook
-> server action/helper
-> authedBackendJson
-> Zod response schema
```

Do not fetch notification endpoints directly from client components.

## Endpoints

```txt
GET    /notifications/status
GET    /notifications?tab=all&page=1&limit=10
GET    /notifications?tab=unread&page=1&limit=10
PATCH  /notifications/read-all
PATCH  /notifications/:notificationId/read
POST   /notifications/:notificationId/invitation
DELETE /notifications/:notificationId
```

## Query Keys

Use stable query keys from:

```txt
src/lib/query/keys.ts
```

After read/delete/respond mutations, invalidate notification status and all
notification lists.

## i18n

Notification titles and bodies use translation keys from the backend payload:

```tsx
t(item.titleKey)
t(item.bodyKey)
```

Do not hard-code notification copy inside components.

## Related Files

```txt
src/app/(root)/_lib/notification-actions.ts
src/app/(root)/_hooks/useNotifications.ts
src/app/(root)/_types/index.ts
src/app/(root)/_types/notification.schemas.ts
src/app/(root)/(pages)/notifications/
```
