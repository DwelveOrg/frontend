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
          className="absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label={t("root.notifications.close")}
        >
          <X className="h-4 w-4" />
        </button>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]">
            <Bell className="h-5 w-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>{notification ? t(notification.titleKey) : null}</AlertDialogTitle>
          <AlertDialogDescription>{notification ? t(notification.bodyKey) : null}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
