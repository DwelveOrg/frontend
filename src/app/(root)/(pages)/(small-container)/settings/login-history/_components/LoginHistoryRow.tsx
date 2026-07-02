"use client";

import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { LoginHistoryItem } from "../_types";

type LoginHistoryRowProps = {
  item: LoginHistoryItem;
};

export function LoginHistoryRow({ item }: Readonly<LoginHistoryRowProps>) {
  const { t } = useTranslation();
  const Icon = item.icon;

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg",
            item.blocked
              ? "bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] text-[var(--destructive)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)]">{t(item.deviceKey)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{t(item.locationKey)}</span>
            <span aria-hidden className="text-[var(--border)]">•</span>
            <span>{t(item.timeKey)}</span>
          </div>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full", item.blocked ? "bg-[var(--destructive)]" : "bg-[var(--success)]")}
        />
        {t(item.statusKey)}
      </span>
    </div>
  );
}
