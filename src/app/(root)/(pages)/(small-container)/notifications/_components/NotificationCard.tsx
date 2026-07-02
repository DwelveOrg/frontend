"use client";

import { Bell, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RelativeTime } from "@/components/Custom/RelativeTime";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/app/(root)/_types";
import type { NotificationTone } from "../_types";

type NotificationCardProps = {
  item: NotificationItem;
  tone: NotificationTone;
  onOpen: (item: NotificationItem) => void;
  onDelete: (id: number) => void;
};

export function NotificationCard({ item, tone, onOpen, onDelete }: Readonly<NotificationCardProps>) {
  const { t } = useTranslation();
  const unread = tone === "unread";

  return (
    <article className="group relative flex items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-[var(--muted)] sm:px-5">
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={t(item.title)}
        className="absolute inset-0 focus-visible:outline-none focus-visible:-outline-offset-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)]"
      />

      <span
        className={cn(
          "pointer-events-none relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-full",
          unread
            ? "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]"
            : "bg-[var(--muted)] text-[var(--muted-foreground)]"
        )}
      >
        <Bell className="h-[18px] w-[18px]" />
      </span>

      <div className="pointer-events-none relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "truncate text-sm text-[var(--foreground)]",
              unread ? "font-semibold" : "font-medium"
            )}
          >
            {t(item.title)}
          </h3>
          {item.unread ? <span aria-hidden className="size-2 shrink-0 rounded-full bg-[var(--primary)]" /> : null}
        </div>
        <p className="mt-0.5 truncate text-[13px] leading-5 text-[var(--muted-foreground)]">
          {t(item.description)}
        </p>
        <RelativeTime date={item.timestamp} className="mt-1.5 block text-xs text-[var(--muted-foreground)]" />
      </div>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="relative -mr-1 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted-foreground)] opacity-0 transition-all hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] group-hover:opacity-100 max-sm:opacity-100"
        aria-label={t("root.notifications.delete")}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
