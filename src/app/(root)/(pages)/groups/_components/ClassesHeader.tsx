"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";

type ClassesHeaderProps = {
  name: string;
  description?: string | null;
  classCount: number;
  studentCount: number;
  teacherCount: number;
  isAdmin: boolean;
  studentJoinCode?: string | null;
};

export default function ClassesHeader({
  name,
  description,
  classCount,
  studentCount,
  teacherCount,
  isAdmin,
  studentJoinCode,
}: ClassesHeaderProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const heading = name || t("root.classes.title");
  const initial = heading.charAt(0).toUpperCase();

  const handleInvite = async () => {
    if (!studentJoinCode) return;
    try {
      await navigator.clipboard.writeText(studentJoinCode);
      setCopied(true);
      toast.success(t("root.dashboard.school.joinCodeCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("root.dashboard.school.joinCodeCopyError"));
    }
  };

  const stats = [
    { key: "classes", dot: "bg-[var(--primary)]", value: classCount, label: t("root.classes.stats.classes") },
    { key: "students", dot: "bg-emerald-500", value: studentCount, label: t("root.classes.stats.students") },
    { key: "teachers", dot: "bg-amber-500", value: teacherCount, label: t("root.classes.stats.teachers") },
  ];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-xl font-bold text-[var(--primary-foreground)]">
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-[var(--foreground)] sm:text-2xl">{heading}</h1>
          <p className="mt-1 max-w-prose text-sm text-[var(--muted-foreground)]">
            {description || t("root.classes.subtitle")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
            {stats.map((stat) => (
              <span key={stat.key} className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                <span className="font-semibold text-[var(--foreground)]">{stat.value}</span>
                {stat.label}
              </span>
            ))}
          </div>
        </div>

        {isAdmin && studentJoinCode ? (
          <Button
            type="button"
            onClick={handleInvite}
            className="h-10 rounded-xl bg-[var(--primary)] px-4 text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {t("root.classes.actions.invite")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
