"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type SchoolDashboardHeaderProps = {
  name: string;
  description?: string | null;
  location?: string | null;
  studentJoinCode?: string | null;
  isAdmin: boolean;
};

export default function SchoolDashboardHeader({
  name,
  description,
  location,
  studentJoinCode,
  isAdmin,
}: SchoolDashboardHeaderProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!studentJoinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(studentJoinCode);
      setCopied(true);
      toast.success(t("root.dashboard.school.joinCodeCopied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("root.dashboard.school.joinCodeCopyError"));
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            {t("root.dashboard.school.eyebrow")}
          </p>
          <h1 className="mt-2 truncate text-2xl font-bold text-[var(--foreground)]">{name}</h1>
          {description ? (
            <p className="mt-1.5 max-w-prose text-sm text-[var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
          {location ? (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{location}</p>
          ) : null}
        </div>

        {isAdmin && studentJoinCode ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <p className="text-xs font-medium text-[var(--muted-foreground)]">
              {t("root.dashboard.school.joinCodeLabel")}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <code className="font-mono text-base font-semibold tracking-wide text-[var(--foreground)]">
                {studentJoinCode}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                aria-label={t("root.dashboard.school.copyJoinCode")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
