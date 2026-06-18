"use client";

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { NotificationItem } from "@/app/(root)/_types";
import type { NotificationTone } from "../_types";
import { NotificationCard } from "./NotificationCard";

type NotificationSectionProps = {
  items: NotificationItem[];
  tone: NotificationTone;
  labelKey: string;
  delay: number;
  onOpen: (item: NotificationItem) => void;
  onDelete: (id: number) => void;
};

export function NotificationSection({
  items,
  tone,
  labelKey,
  delay,
  onOpen,
  onDelete,
}: Readonly<NotificationSectionProps>) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const isUnread = tone === "unread";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.24 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 px-1">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.06, duration: 0.22 }}
          className={`h-2 w-2 rounded-full ${isUnread ? "bg-[#0046FF]" : "bg-slate-400 dark:bg-slate-500"}`}
        />
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.06, duration: 0.22 }}
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            isUnread ? "text-[#0046FF] dark:text-[#8fb0ff]" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {t(labelKey)}
        </motion.p>
      </div>
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} tone={tone} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}
