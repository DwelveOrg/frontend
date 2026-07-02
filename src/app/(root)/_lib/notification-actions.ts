"use server";

import {
  authedBackendJson,
  SessionExpiredError,
} from "@/app/(authentication)/_lib/backend";
import type {
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
  return authedBackendJson<NotificationsListResponse>(buildNotificationsPath(input));
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
