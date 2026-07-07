"use client";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { TONE_DOT, UPCOMING } from "../_constants";
import Panel from "./Panel";

export default function UpcomingPanel() {
  const { t } = useTranslation();

  return (
    <Panel title={t("root.dashboard.upcoming.title")} bodyClassName="p-2.5 md:p-3">
      <ul className="space-y-1">
        {UPCOMING.map((item) => {
          const highlight = item.tone === "warning";
          const base = `root.dashboard.upcoming.items.${item.key}`;
          return (
            <li
              key={item.key}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                highlight
                  ? "bg-[color-mix(in_srgb,var(--warning)_12%,transparent)]"
                  : "hover:bg-[var(--muted)]/60",
              )}
            >
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", TONE_DOT[item.tone])} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {t(`${base}.title`)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{t(`${base}.due`)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
