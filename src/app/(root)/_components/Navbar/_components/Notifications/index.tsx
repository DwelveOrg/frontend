"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { notificationItems } from "../../../../_constants/index";
import { RelativeTime } from "@/components/Custom/RelativeTime";
import Link from "next/link";

type NotificationsProps = {
  onItemClick?: () => void;
};

const Notifications = ({ onItemClick }: NotificationsProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const unreadMessages = useMemo(() => notificationItems.filter((item) => item.unread), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-[320px] rounded-2xl border border-[var(--border)] bg-[var(--popover)] p-4 shadow-lg max-[350px]:w-[260px] max-[350px]:rounded-xl max-[350px]:p-3">
      <div
        aria-hidden="true"
        className="absolute -top-2 max-[350px]:-top-[6px] right-4 max-[350px]:right-[17px] h-4 w-4 rotate-45 border-l border-t border-[var(--border)] bg-[var(--popover)] max-[350px]:right-3 max-[350px]:h-3 max-[350px]:w-3"
      />


      {isLoading ? (
        <div className="space-y-3 max-[350px]:space-y-2.5">
          <div
            className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3 max-[350px]:rounded-lg max-[350px]:p-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-28 rounded bg-[var(--border)] max-[350px]:h-3 max-[350px]:w-24" />
                <div className="mt-2 h-3 w-full rounded bg-[var(--border)]" />
                <div className="mt-1 h-3 w-4/5 rounded bg-[var(--border)]" />
              </div>
              <div className="h-3 w-14 shrink-0 rounded bg-[var(--border)]" />
            </div>
          </div>

        </div>
      ) : unreadMessages.length > 0 ? (
        <div className="space-y-3 max-[350px]:space-y-2.5">
          {unreadMessages.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border cursor-pointer border-[var(--border)] bg-[var(--muted)] p-3 transition hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] max-[350px]:rounded-lg max-[350px]:p-2.5"
            >
              <Link href="/notifications" className="flex items-start justify-between gap-3" onClick={onItemClick}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)] max-[350px]:text-xs">
                      {t(item.title)}
                    </p>
                    {item.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)] max-w-full truncate max-[350px]:text-xs">
                    {t(item.description)}
                  </p>
                </div>
                <RelativeTime
                  date={item.timestamp}
                  className="shrink-0 text-xs text-[var(--muted-foreground)]"
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-3 max-[350px]:gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] max-[350px]:h-8 max-[350px]:w-8 max-[350px]:rounded-lg">
            <Inbox className="h-5 w-5 max-[350px]:h-4 max-[350px]:w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] max-[350px]:text-xs">{t("root.notifications.emptyTitle")}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)] max-[350px]:text-xs">
              {t("root.notifications.emptyDescription")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
