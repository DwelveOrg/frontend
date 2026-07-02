"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Row({
  icon: Icon,
  title,
  description,
  action,
  danger = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`grid gap-4 rounded-xl border p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
        danger
          ? "border-[color-mix(in_srgb,var(--destructive)_30%,transparent)] bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)]"
          : "border-[var(--border)] bg-[var(--muted)]"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            danger
              ? "bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] text-[var(--destructive)]"
              : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${danger ? "text-[var(--destructive)]" : "text-[var(--foreground)]"}`}>{title}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
      </div>
      {action ? (
        <div className="flex w-full md:w-auto md:justify-end [&>*]:inline-flex [&>*]:min-h-11 [&>*]:w-full [&>*]:items-center [&>*]:justify-center md:[&>*]:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}
