"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import type { SchoolRole } from "@/app/(authentication)/_types/auth";
import { GRADE_TREND } from "../_constants";
import Panel from "./Panel";

/** Bar height as a percentage of the plot area — floored so the shortest month
 *  still reads as a bar, ceilinged at the tallest value. */
function heightPct(value: number, min: number, max: number): number {
  if (max === min) return 100;
  const norm = (value - min) / (max - min);
  return Math.round(42 + norm * 58);
}

/** Fill intensity ramps with the value: lighter tint for low months, saturated
 *  brand violet for the best. Token-derived via color-mix, transparent over the
 *  muted track so it works in both themes. */
function fill(value: number, min: number, max: number): string {
  const norm = max === min ? 1 : (value - min) / (max - min);
  const intensity = Math.round(52 + norm * 48);
  return `color-mix(in srgb, var(--primary) ${intensity}%, transparent)`;
}

export default function GradeTrendChart({ role }: { role: SchoolRole | undefined }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const { min, max } = useMemo(() => {
    const values = GRADE_TREND.map((p) => p.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, []);

  const isStaff = role === "ADMIN" || role === "TEACHER";
  const title = t(isStaff ? "root.dashboard.trend.titleStaff" : "root.dashboard.trend.titleStudent");

  return (
    <Panel title={title} aside={t("root.dashboard.trend.caption")}>
      <div
        role="img"
        aria-label={t("root.dashboard.trend.aria")}
        className="flex h-52 items-end gap-2 rounded-xl bg-[var(--muted)]/45 p-4 sm:gap-3"
      >
        {GRADE_TREND.map((point, index) => (
          <div
            key={point.monthKey}
            className="group flex h-full flex-1 flex-col items-center justify-end"
            title={`${t(`root.dashboard.trend.months.${point.monthKey}`)}: ${point.value}`}
          >
            <motion.div
              className="relative w-full rounded-t-lg"
              style={{
                height: `${heightPct(point.value, min, max)}%`,
                background: fill(point.value, min, max),
                transformOrigin: "bottom",
              }}
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : 0.05 + index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-[var(--foreground)] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--background)] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                {point.value}
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2 px-4 sm:gap-3">
        {GRADE_TREND.map((point) => (
          <span
            key={point.monthKey}
            className="flex-1 text-center text-xs font-medium text-[var(--muted-foreground)]"
          >
            {t(`root.dashboard.trend.months.${point.monthKey}`)}
          </span>
        ))}
      </div>
    </Panel>
  );
}
