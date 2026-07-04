"use server";

import {
  authedBackendJson,
  SessionExpiredError,
} from "@/app/(authentication)/_lib/backend";
import type {
  InvitationResponse,
  NotificationStatusResponse,
  NotificationsListResponse,
  NotificationTab,
} from "@/app/(root)/_types";

type ListNotificationsInput = {
  tab?: NotificationTab;
  page?: number;
  limit?: number;
};

function buildNotificationsPath(input: ListNotificationsInput = {}) {
  const params = new URLSearchParams({
    tab: input.tab ?? "all",
    page: String(input.page ?? 1),
    limit: String(input.limit ?? 10),
  });

  return `/notifications?${params.toString()}`;
}

const EMPTY_STATUS: NotificationStatusResponse = {
  hasUnread: false,
  unreadCount: 0,
};

export async function getNotificationStatusAction(): Promise<NotificationStatusResponse> {
  try {
    return await authedBackendJson<NotificationStatusResponse>("/notifications/status");
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return EMPTY_STATUS;
    }

    throw error;
  }
}

export async function listNotificationsAction(
  input: ListNotificationsInput = {},
): Promise<NotificationsListResponse> {
  const response = await authedBackendJson<NotificationsListResponse>(
    buildNotificationsPath(input),
  );

  // The backend is the source of truth for read state via `readAt`; it does not
  // send the `unread` convenience flag the UI reads, so derive it here once.
  return {
    ...response,
    data: response.data.map((item) => ({ ...item, unread: item.readAt == null })),
  };
}

export async function markNotificationReadAction(notificationId: string) {
  return authedBackendJson(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}

export async function deleteNotificationAction(notificationId: string) {
  return authedBackendJson(`/notifications/${notificationId}`, {
    method: "DELETE",
  });
}

/**
 * Marks every unread notification as read in one call.
 *
 * Prefers the dedicated bulk endpoint (`PATCH /notifications/read-all`, see
 * docs/BACKEND_NOTIFICATIONS_EXTENSIONS.md). Until the backend ships it, this
 * falls back to reading each known unread id so the feature works today.
 */
export async function markAllNotificationsReadAction(ids: string[] = []) {
  try {
    return await authedBackendJson("/notifications/read-all", { method: "PATCH" });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      throw error;
    }

    await Promise.allSettled(ids.map((id) => markNotificationReadAction(id)));
    return { ok: true, fallback: true } as const;
  }
}

/**
 * Accepts or declines an invitation-type notification.
 *
 * Prefers the dedicated invitation endpoint
 * (`POST /notifications/:id/invitation`, see the backend doc). Until it exists,
 * responding still resolves the card by marking it read so the UI stays
 * consistent.
 */
export async function respondToInvitationAction(
  notificationId: string,
  response: InvitationResponse,
) {
  try {
    return await authedBackendJson(`/notifications/${notificationId}/invitation`, {
      method: "POST",
      body: { response },
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      throw error;
    }

    await markNotificationReadAction(notificationId);
    return { ok: true, fallback: true } as const;
  }
}
