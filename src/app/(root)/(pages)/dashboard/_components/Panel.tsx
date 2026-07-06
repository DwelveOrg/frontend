import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelProps = {
  /** Section heading rendered at the top of the panel. Omit for a bare surface. */
  title?: ReactNode;
  /** Optional trailing element on the title row (caption, link, control). */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Padding on the outer surface. Defaults to comfortable panel padding. */
  bodyClassName?: string;
};

/**
 * Flat content surface for the dashboard: hairline border, token background, no
 * shadow — the deliberately flat authenticated-shell look (see PRODUCT.md). One
 * source of truth so every dashboard panel shares the same radius, border, and
 * heading rhythm instead of re-declaring the class string per card.
 */
export default function Panel({ title, aside, children, className, bodyClassName }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)]",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6">
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          {aside ? <div className="shrink-0 text-sm text-[var(--muted-foreground)]">{aside}</div> : null}
        </div>
      ) : null}
      <div className={cn("p-5 md:p-6", title && "pt-4 md:pt-4", bodyClassName)}>{children}</div>
    </section>
  );
}
