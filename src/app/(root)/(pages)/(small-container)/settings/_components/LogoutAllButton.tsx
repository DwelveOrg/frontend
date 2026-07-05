"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { logoutAll } from "@/app/(authentication)/_lib/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { rowActionClassName } from "../_constants";

/**
 * Trailing control for the "logout from all devices" row. Confirms intent, then
 * calls the {@link logoutAll} server action which clears every Redis refresh
 * session and redirects to login. The dialog stays open (and locked) while the
 * action is in flight so the navigation always follows a deliberate confirm.
 */
export function LogoutAllButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await logoutAll();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <button type="button" className={rowActionClassName}>
          {t("root.settings.actions.logout")}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] text-[var(--destructive)]">
            <LogOut />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t("root.settings.security.logoutAllDevices.confirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("root.settings.security.logoutAllDevices.confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("root.settings.security.logoutAllDevices.cancel")}
          </AlertDialogCancel>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--destructive)] px-4 py-2 text-sm font-semibold text-[var(--destructive-foreground)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--destructive)_45%,transparent)] disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t("root.settings.security.logoutAllDevices.confirm")}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
