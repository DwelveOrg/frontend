"use client";

import { useTranslation } from "react-i18next";

import type { SchoolRole } from "@/app/(authentication)/_types/auth";
import { cn } from "@/lib/utils";
import { statsForRole, TONE_TEXT, type DashboardStat } from "../_constants";

function StatCard({ group, stat }: { group: string; stat: DashboardStat }) {
  const { t } = useTranslation();
  const base = `root.dashboard.cards.${group}.${stat.key}`;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--border))]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{t(`${base}.label`)}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums text-[var(--foreground)]">
        {stat.value}
      </p>
      <p className={cn("mt-2 text-[13px] font-medium", TONE_TEXT[stat.tone])}>
        {t(`${base}.hint`)}
      </p>
    </div>
  );
}

export default function StatCards({ role }: { role: SchoolRole | undefined }) {
  const stats = statsForRole(role);
  const group = role === "ADMIN" || role === "TEACHER" ? "staff" : "student";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.key} group={group} stat={stat} />
      ))}
    </div>
  );
}
