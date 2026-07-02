"use client";

import { useState } from "react";
import { Check, Copy, MapPin, School } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type SchoolInfoCardProps = {
  name: string;
  description?: string | null;
  location?: string | null;
  studentJoinCode?: string | null;
  isAdmin: boolean;
  isActive?: boolean;
};

export default function SchoolInfoCard({
  name,
  description,
  location,
  studentJoinCode,
  isAdmin,
  isActive,
}: SchoolInfoCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <School className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold text-[var(--foreground)]">{name}</h2>
            {isActive !== undefined && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {isActive ? t("root.schoolPage.active") : t("root.schoolPage.inactive")}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      {isAdmin && studentJoinCode && (
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
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
      )}
    </div>
  );
}
