import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** Large page title shown at the top of the content area. */
  title: ReactNode;
  /** Optional one-line supporting copy beneath the title. */
  subtitle?: ReactNode;
  /** Optional trailing actions (buttons), right-aligned on wide screens. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Content-area page header — the large title that used to live in the top bar.
 * The top bar now only carries the breadcrumb, so each view names itself here.
 * Reuse this everywhere a page needs a heading instead of re-styling an <h1>.
 */
export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="truncate text-[26px] font-bold leading-tight tracking-tight text-[var(--foreground)] capitalize md:text-[28px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
