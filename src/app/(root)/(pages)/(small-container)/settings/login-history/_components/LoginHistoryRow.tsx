"use client";

import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LoginHistoryItem } from "../_types";

type LoginHistoryRowProps = {
  item: LoginHistoryItem;
};

export function LoginHistoryRow({ item }: Readonly<LoginHistoryRowProps>) {
  const { t } = useTranslation();
  const Icon = item.icon;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
        item.blocked
          ? "border-red-200/80 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/10"
          : "border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-white/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
            item.blocked
              ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
              : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(item.deviceKey)}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5" />
            <span>{t(item.locationKey)}</span>
            <span className="text-slate-300 dark:text-slate-600">-</span>
            <span>{t(item.timeKey)}</span>
          </div>
        </div>
      </div>
      <span
        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
          item.blocked
            ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
            : "bg-[#eaf1ff] text-[#0046FF] dark:bg-[#1b2a4a] dark:text-[#9fb8ff]"
        }`}
      >
        {t(item.statusKey)}
      </span>
    </div>
  );
}
