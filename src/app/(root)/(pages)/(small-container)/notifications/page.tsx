"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Empty from "../../_components/ui/Empty";
import { notificationItems } from "@/app/(root)/_constants";
import type { NotificationItem } from "@/app/(root)/_types";
import { NotificationDetailsDialog } from "./_components/NotificationDetailsDialog";
import { NotificationSection } from "./_components/NotificationSection";

const Page = () => {
  const [items, setItems] = useState<NotificationItem[]>(notificationItems);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  const unreadMessages = useMemo(() => items.filter((item) => item.unread), [items]);
  const readMessages = useMemo(() => items.filter((item) => !item.unread), [items]);
  const selectedNotification = useMemo(
    () => items.find((item) => item.id === selectedNotificationId) ?? null,
    [items, selectedNotificationId]
  );

  const handleDelete = (id: number) => {
    setItems((current) => current.filter((notification) => notification.id !== id));
    setSelectedNotificationId((current) => (current === id ? null : current));
  };

  const handleOpenNotification = (item: NotificationItem) => {
    setSelectedNotificationId(item.id);
    setItems((current) =>
      current.map((notification) =>
        notification.id === item.id ? { ...notification, unread: false } : notification
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[60vh] w-full flex-col"
    >
      <AnimatePresence mode="wait">
        {items.length > 0 ? (
          <motion.section
            key="notifications-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.24 }}
            className="space-y-4"
          >
            <NotificationSection
              items={unreadMessages}
              tone="unread"
              labelKey="root.notifications.unread"
              delay={0.12}
              onOpen={handleOpenNotification}
              onDelete={handleDelete}
            />
            <NotificationSection
              items={readMessages}
              tone="read"
              labelKey="root.notifications.read"
              delay={0.18}
              onOpen={handleOpenNotification}
              onDelete={handleDelete}
            />
          </motion.section>
        ) : (
          <motion.section
            key="notifications-empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="flex flex-1 items-center justify-center"
          >
            <Empty />
          </motion.section>
        )}
      </AnimatePresence>

      <NotificationDetailsDialog notification={selectedNotification} onClose={() => setSelectedNotificationId(null)} />
    </motion.div>
  );
};

export default Page;
