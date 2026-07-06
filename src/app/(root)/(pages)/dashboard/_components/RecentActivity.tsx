"use client";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { RECENT_ACTIVITY, TONE_BADGE } from "../_constants";
import Panel from "./Panel";

export default function RecentActivity() {
  const { t } = useTranslation();

  return (
    <Panel title={t("root.dashboard.activity.title")} bodyClassName="p-2.5 md:p-3">
      <ul>
        {RECENT_ACTIVITY.map((item) => {
          const base = `root.dashboard.activity.items.${item.key}`;
          return (
            <li
              key={item.key}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[var(--muted)]/60"
            >
              <span
                aria-hidden
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold",
                  TONE_BADGE[item.tone],
                )}
              >
                {item.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {t(`${base}.title`)}
                </p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {t(`${base}.meta`)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                {t(`${base}.ago`)}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
