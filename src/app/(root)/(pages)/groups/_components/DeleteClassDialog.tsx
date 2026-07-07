"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useDeleteClassMutation } from "@/app/(root)/(pages)/school/_hooks/useDeleteClassMutation";

type DeleteClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  className: string;
  /**
   * When the delete happens from the detail page, we route back to `/groups`.
   * Cards on the list refresh in place, so leave this off there.
   */
  redirectOnSuccess?: string;
};

export default function DeleteClassDialog({
  open,
  onOpenChange,
  classId,
  className,
  redirectOnSuccess,
}: DeleteClassDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const deleteClass = useDeleteClassMutation();

  const isBusy = deleteClass.isPending;

  const handleDelete = () => {
    deleteClass.mutate(
      { classId },
      {
        onSuccess: () => {
          toast.success(t("root.classDetail.delete.success", { name: className }));
          onOpenChange(false);
          if (redirectOnSuccess) {
            router.push(redirectOnSuccess);
          }
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : t("root.classDetail.delete.error"),
          );
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t("root.classDetail.delete.title", { name: className })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("root.classDetail.delete.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>
            {t("root.classDetail.delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isBusy}
          >
            {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t("root.classDetail.delete.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
