"use client";

import { useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSchoolAction } from "@/app/(root)/_lib/school-actions";

type DeleteSchoolDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolName: string;
};

/**
 * Admin-only school deletion. On success the server action re-syncs the session
 * and redirects to `/dashboard`, so we only handle the error path here (mirrors
 * `SessionsPanel`'s redirecting-action pattern).
 */
export default function DeleteSchoolDialog({
  open,
  onOpenChange,
  schoolName,
}: DeleteSchoolDialogProps) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSchoolAction({});
      // Reaching here means no redirect happened — i.e. the delete failed.
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      toast.error(t("root.schoolPage.delete.error"));
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t("root.schoolPage.delete.title", { name: schoolName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("root.schoolPage.delete.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("root.schoolPage.delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t("root.schoolPage.delete.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
