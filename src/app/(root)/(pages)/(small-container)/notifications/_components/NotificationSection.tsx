"use client";

import { motion } from "motion/react";
import type { NotificationItem } from "@/app/(root)/_types";
import { cn } from "@/lib/utils";
import { NotificationCard } from "./NotificationCard";

type NotificationSectionProps = {
  items: NotificationItem[];
  label: string;
  delay: number;
  onOpen: (item: NotificationItem) => void;
  onDelete: (id: string) => void;
};

export function NotificationSection({
  items,
  label,
  delay,
  onOpen,
  onDelete,
}: Readonly<NotificationSectionProps>) {
  if (items.length === 0) return null;

  const hasUnread = items.some((item) => item.unread);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.24 }}
      className="space-y-2.5"
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.06, duration: 0.22 }}
          className={cn(
            "text-[13px] font-semibold",
            hasUnread ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
          )}
        >
          {label}
        </motion.span>
        <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} onOpen={onOpen} onDelete={onDelete} />
        ))}
      </div>
    </motion.div>
  );
}
