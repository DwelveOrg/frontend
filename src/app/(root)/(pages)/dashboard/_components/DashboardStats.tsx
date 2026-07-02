"use client";

import { BookOpen, GraduationCap, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
};

function StatCard({ icon, label, value, change, positive }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </span>
        {change && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              positive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

export default function DashboardStats() {
  const { t } = useTranslation();

  const stats: StatCardProps[] = [
    {
      icon: <Users className="h-5 w-5" />,
      label: t("root.dashboard.stats.totalStudents"),
      value: "128",
      change: "+12%",
      positive: true,
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      label: t("root.dashboard.stats.totalClasses"),
      value: "6",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: t("root.dashboard.stats.totalExams"),
      value: "24",
      change: "+3",
      positive: true,
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: t("root.dashboard.stats.avgScore"),
      value: "76%",
      change: "+4%",
      positive: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
