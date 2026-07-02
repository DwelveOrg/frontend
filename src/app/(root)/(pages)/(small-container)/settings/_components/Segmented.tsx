"use client";

import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const highlightEase = [0.22, 1, 0.36, 1] as const;

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type SegmentedProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel: string;
  /** Unique id so the sliding highlight animates only within this control. */
  layoutId: string;
};

/**
 * A flat segmented control: one tap to switch, with a sliding brand-tinted
 * indicator. Replaces dropdown selects for small, mutually-exclusive choices
 * (theme, language). The selected segment is the only place violet appears —
 * "accent means selection", per the design system.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  layoutId,
}: SegmentedProps<T>) {
  const reduce = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-1"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className="relative flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--muted)]"
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-lg bg-[var(--card)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--primary)_28%,var(--border))]"
                transition={{ duration: reduce ? 0 : 0.28, ease: highlightEase }}
              />
            ) : null}
            {Icon ? (
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                )}
              />
            ) : null}
            <span
              className={cn(
                "truncate transition-colors",
                active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
