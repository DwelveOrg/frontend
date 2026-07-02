"use client";

import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

import { formatRelativeTime } from "@/lib/datetime";

type RelativeTimeProps = {
  /** ISO string, epoch millis, or Date — the moment to describe. */
  date: Date | string | number;
  className?: string;
};

/**
 * Renders a live, localized "x ago" label (e.g. "2 hours ago") that refreshes
 * once a minute and follows the active i18n language. Reused anywhere a
 * relative timestamp is shown (notifications, activity, etc.) instead of
 * hard-coding per-language strings.
 */
export function RelativeTime({ date, className }: Readonly<RelativeTimeProps>) {
  const { i18n } = useTranslation();
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Timestamps naturally differ between the SSR pass and the first client tick,
  // so suppress the expected hydration text mismatch on this node.
  return (
    <span className={className} suppressHydrationWarning>
      {formatRelativeTime(date, i18n.language)}
    </span>
  );
}
