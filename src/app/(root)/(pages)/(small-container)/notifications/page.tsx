"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import Empty from "../../_components/ui/Empty";
import type { NotificationItem, NotificationTab } from "@/app/(root)/_types";
import {
  useDeleteNotificationMutation,
  useMarkNotificationReadMutation,
  useNotificationsList,
} from "@/app/(root)/_hooks/useNotifications";
import { cn } from "@/lib/utils";
import { NotificationDetailsDialog } from "./_components/NotificationDetailsDialog";
import { NotificationSection } from "./_components/NotificationSection";

type NotificationGroup = {
  key: string;
  label: string;
  items: NotificationItem[];
};

const PAGE_SIZE = 10;

function getDayKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

const Page = () => {
  const { i18n, t } = useTranslation();
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [optimisticallyReadIds, setOptimisticallyReadIds] = useState<Set<string>>(() => new Set());
  const [optimisticallyDeletedIds, setOptimisticallyDeletedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const notificationsQuery = useNotificationsList({ tab: activeTab, limit: PAGE_SIZE });
  const markReadMutation = useMarkNotificationReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  const allItems = useMemo(
    () =>
      notificationsQuery.data?.pages
        .flatMap((page) => page.data)
        .map((item) =>
          optimisticallyReadIds.has(item.id)
            ? { ...item, unread: false, readAt: item.readAt ?? new Date().toISOString() }
            : item,
        ) ?? [],
    [notificationsQuery.data?.pages, optimisticallyReadIds],
  );

  const visibleItems = useMemo(
    () =>
      allItems.filter((item) => {
        if (optimisticallyDeletedIds.has(item.id)) return false;
        if (activeTab === "unread" && optimisticallyReadIds.has(item.id)) return false;
        return true;
      }),
    [activeTab, allItems, optimisticallyDeletedIds, optimisticallyReadIds],
  );

  const groupedItems = useMemo<NotificationGroup[]>(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formatter = new Intl.DateTimeFormat(i18n.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const groups = new Map<string, NotificationGroup>();

    for (const item of visibleItems) {
      const date = new Date(item.createdAt);
      const key = getDayKey(item.createdAt);
      const label = isSameDay(date, today)
        ? t("root.notifications.dateGroups.today")
        : isSameDay(date, yesterday)
          ? t("root.notifications.dateGroups.yesterday")
          : formatter.format(date);

      if (!groups.has(key)) {
        groups.set(key, { key, label, items: [] });
      }

      groups.get(key)?.items.push(item);
    }

    return Array.from(groups.values());
  }, [i18n.language, t, visibleItems]);

  const handleDelete = (id: string) => {
    setOptimisticallyDeletedIds((current) => new Set(current).add(id));
    setSelectedNotification((current) => (current?.id === id ? null : current));
    deleteNotificationMutation.mutate(id, {
      onError: () => {
        setOptimisticallyDeletedIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
      },
    });
  };

  const handleOpenNotification = (item: NotificationItem) => {
    const selected = {
      ...item,
      unread: false,
      readAt: item.readAt ?? new Date().toISOString(),
    };

    setSelectedNotification(selected);

    if (!item.unread) return;

    setOptimisticallyReadIds((current) => new Set(current).add(item.id));
    markReadMutation.mutate(item.id, {
      onError: () => {
        setOptimisticallyReadIds((current) => {
          const next = new Set(current);
          next.delete(item.id);
          return next;
        });
      },
    });
  };

  const tabs: Array<{ value: NotificationTab; label: string }> = [
    { value: "all", label: t("root.notifications.tabs.all") },
    { value: "unread", label: t("root.notifications.tabs.unread") },
  ];

  const hasItems = visibleItems.length > 0;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[60vh] w-full flex-col"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                activeTab === tab.value
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {notificationsQuery.isLoading ? (
          <motion.section
            key="notifications-loading"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[86px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              />
            ))}
          </motion.section>
        ) : notificationsQuery.isError ? (
          <motion.section
            key="notifications-error"
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 items-center justify-center"
          >
            <Empty
              title={t("root.notifications.errorTitle")}
              description={t("root.notifications.errorDescription")}
            />
          </motion.section>
        ) : hasItems ? (
          <motion.section
            key="notifications-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.24 }}
            className="space-y-7"
          >
            {groupedItems.map((group, index) => (
              <NotificationSection
                key={group.key}
                items={group.items}
                label={group.label}
                delay={0.12 + index * 0.04}
                onOpen={handleOpenNotification}
                onDelete={handleDelete}
              />
            ))}

            {notificationsQuery.hasNextPage ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => void notificationsQuery.fetchNextPage()}
                  disabled={notificationsQuery.isFetchingNextPage}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {notificationsQuery.isFetchingNextPage
                    ? t("root.notifications.loading")
                    : t("root.notifications.loadMore")}
                </button>
              </div>
            ) : null}
          </motion.section>
        ) : (
          <motion.section
            key="notifications-empty"
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 items-center justify-center"
          >
            <Empty
              title={t("root.notifications.emptyTitle")}
              description={t("root.notifications.emptyDescription")}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <NotificationDetailsDialog notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </motion.div>
  );
};

export default Page;
