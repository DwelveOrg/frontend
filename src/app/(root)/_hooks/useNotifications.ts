"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteNotificationAction,
  getNotificationStatusAction,
  listNotificationsAction,
  markNotificationReadAction,
} from "@/app/(root)/_lib/notification-actions";
import type { NotificationTab } from "@/app/(root)/_types";
import { queryKeys } from "@/lib/query/keys";

type UseNotificationsListOptions = {
  tab: NotificationTab;
  limit?: number;
  enabled?: boolean;
};

export function useNotificationStatus() {
  return useQuery({
    queryKey: queryKeys.notifications.status(),
    queryFn: getNotificationStatusAction,
  });
}

export function useNotificationsList({
  tab,
  limit = 10,
  enabled = true,
}: UseNotificationsListOptions) {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(tab, limit),
    queryFn: ({ pageParam }) => listNotificationsAction({ tab, limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
    enabled,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationReadAction,
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.status() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
      ]);
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotificationAction,
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.status() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
      ]);
    },
  });
}
