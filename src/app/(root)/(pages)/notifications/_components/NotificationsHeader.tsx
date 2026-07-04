"use client";

import { CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationsHeaderProps = {
  unreadCount: number;
  onMarkAllRead: () => void;
  isMarkingAll: boolean;
};

export function NotificationsHeader({
  unreadCount,
  onMarkAllRead,
  isMarkingAll,
}: Readonly<NotificationsHeaderProps>) {
  const { t } = useTranslation();
  const hasUnread = unreadCount > 0;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {t("root.notifications.title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {hasUnread
            ? t("root.notifications.summary.some", { count: unreadCount })
            : t("root.notifications.summary.none")}
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={!hasUnread || isMarkingAll}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCheck className="h-4 w-4" />
        {t("root.notifications.markAllRead")}
      </button>
    </div>
  );
}
