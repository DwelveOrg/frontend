"use client";

import { useTranslation } from "react-i18next";
import type { ClassItem } from "../_types";

type ClassCardProps = {
  item: ClassItem;
  /** Tailwind classes for the letter-avatar tint (see `classAccents`). */
  accent: string;
};

export default function ClassCard({ item, accent }: ClassCardProps) {
  const { t } = useTranslation();
  const initial = item.name.charAt(0).toUpperCase();
  const isActive = item.status === "active";

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold ${accent}`}
        >
          {initial}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-[var(--foreground)]">{item.name}</h3>
          <p className="truncate text-xs text-[var(--muted-foreground)]">{item.course}</p>
        </div>
      </div>

      <p className="mt-4 truncate text-sm text-[var(--muted-foreground)]">{item.teacher}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-lg bg-[var(--muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
          {t("root.classes.card.students", { count: item.studentCount })}
        </span>
        <span
          className={`text-xs font-semibold ${
            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--muted-foreground)]"
          }`}
        >
          {isActive ? t("root.classes.status.active") : t("root.classes.status.archived")}
        </span>
      </div>
    </div>
  );
}
