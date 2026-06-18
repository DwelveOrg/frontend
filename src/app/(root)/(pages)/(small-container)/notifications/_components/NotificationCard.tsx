"use client";

import { Bell, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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

  return (
    <article
      onClick={() => onOpen(item)}
      className={`cursor-pointer rounded-[24px] border p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition dark:border-white/10 dark:bg-[#1f1f1f] dark:hover:border-white/15 ${
        tone === "unread"
          ? "border-slate-200/80 bg-white/90 hover:border-slate-300"
          : "border-slate-200/80 bg-white/90 hover:border-slate-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0046FF] text-white">
          <Bell className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{t(item.title)}</h2>
                {item.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-[#0046FF]" /> : null}
              </div>
              <p className="mt-1 max-w-full truncate text-sm leading-6 text-slate-500 dark:text-slate-300">
                {t(item.description)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t(item.timestamp)}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(item.id);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-red-400/30 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                aria-label={t("root.notifications.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
