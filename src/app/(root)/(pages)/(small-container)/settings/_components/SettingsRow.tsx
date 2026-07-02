"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type SettingsRowProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Navigational row: the whole row links here and shows a chevron. */
  href?: string;
  /** Inline trailing control for rows that perform an action (buttons, links). */
  action?: ReactNode;
  /** Full-width control rendered below the label (segmented switches, etc.). */
  control?: ReactNode;
  /** Not-yet-available row: dimmed, non-interactive, "Soon" pill. */
  soon?: boolean;
  danger?: boolean;
};

export function SettingsRow({
  icon: Icon,
  title,
  description,
  href,
  action,
  control,
  soon = false,
  danger = false,
}: Readonly<SettingsRowProps>) {
  const { t } = useTranslation();

  const head = (
    <div className="flex items-start gap-3.5">
      <span
        className={cn(
          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
          danger
            ? "bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] text-[var(--destructive)]"
            : "bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            danger ? "text-[var(--destructive)]" : "text-[var(--foreground)]"
          )}
        >
          {title}
        </p>
        {description ? (
          <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </div>

      {href ? (
        <ChevronRight className="mt-1.5 h-[18px] w-[18px] shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : soon ? (
        <span className="mt-0.5 inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
          {t("root.settings.actions.comingSoon")}
        </span>
      ) : action ? (
        <div className="mt-0.5 shrink-0">{action}</div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block px-4 py-3.5 transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:-outline-offset-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)] sm:px-5"
      >
        {head}
      </Link>
    );
  }

  return (
    <div className={cn("px-4 py-4 sm:px-5", soon && "opacity-70")}>
      {head}
      {control ? <div className="mt-3.5 sm:pl-[3.125rem]">{control}</div> : null}
    </div>
  );
}
