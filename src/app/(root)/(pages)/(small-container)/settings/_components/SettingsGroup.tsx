"use client";

import type { ReactNode } from "react";

/**
 * A labelled settings group: a quiet section label above a single flat panel
 * whose rows are separated by hairline dividers. Replaces the old
 * card-inside-card pattern (SectionCard wrapping bordered Row cards) so the
 * surface reads as one structured list, not stacked floating cards.
 */
export function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2.5 px-1 text-[13px] font-semibold text-[var(--muted-foreground)]">
        {label}
      </h2>
      <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {children}
      </div>
    </section>
  );
}
