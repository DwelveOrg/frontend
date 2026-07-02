"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

const entryEase = [0.22, 1, 0.36, 1] as const;

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: entryEase }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div className="flex items-center gap-3.5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-4">{children}</div>
    </motion.section>
  );
}
