"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type DashboardHeaderProps = {
  fullName: string | null;
  /** Shown as a compact copyable chip for admins so the join code stays reachable. */
  studentJoinCode?: string | null;
  isAdmin: boolean;
};

function getFirstName(fullName: string | null): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0];
}

/**
 * Dashboard title block: a plain, task-focused greeting (no orchestrated load
 * animation, no oversized display treatment — see product register) plus, for
 * admins, the student join code folded in as a compact action so the reference
 * layout stays clean without dropping that affordance.
 */
export default function DashboardHeader({
  fullName,
  studentJoinCode,
  isAdmin,
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const firstName = getFirstName(fullName);
  const title = firstName
    ? t("root.dashboard.welcome.title", { name: firstName })
    : t("root.dashboard.welcome.titleGeneric");

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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-balance text-[var(--foreground)] md:text-[30px]">
          {title}
        </h1>
        <p className="mt-1.5 text-[15px] text-[var(--muted-foreground)]">
          {t("root.dashboard.welcome.subtitle")}
        </p>
      </div>

      {isAdmin && studentJoinCode ? (
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2.5">
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-[var(--muted-foreground)]">
              {t("root.dashboard.school.joinCodeLabel")}
            </p>
            <code className="font-mono text-base font-semibold tracking-wide text-[var(--foreground)]">
              {studentJoinCode}
            </code>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            aria-label={t("root.dashboard.school.copyJoinCode")}
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--success)]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : null}
    </header>
  );
}
