"use client";

import { Bell, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { NotificationItem } from "@/app/(root)/_types";

type NotificationDetailsDialogProps = {
  notification: NotificationItem | null;
  onClose: () => void;
};

export function NotificationDetailsDialog({ notification, onClose }: Readonly<NotificationDetailsDialogProps>) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      open={notification !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-transparent text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={t("root.notifications.close")}
        >
          <X className="h-4 w-4" />
        </button>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-transparent text-slate-500 dark:text-slate-300">
            <Bell className="h-5 w-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>{notification ? t(notification.title) : null}</AlertDialogTitle>
          <AlertDialogDescription>{notification ? t(notification.description) : null}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
