"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog as DialogPrimitive } from "radix-ui";

import { Button } from "@/components/ui/Button";
import Textarea from "@/components/ui/textarea";
import Dialog from "@/app/(root)/_components/Dialog";

type RejectRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  isSubmitting: boolean;
  onConfirm: (reason: string) => void;
};

const REASON_MAX = 500;

/** Confirms rejecting a join request, with an optional reason for the student. */
export default function RejectRequestDialog({
  open,
  onOpenChange,
  studentName,
  isSubmitting,
  onConfirm,
}: RejectRequestDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const close = (value: boolean) => {
    onOpenChange(value);
    if (!value) setReason("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={close}
      title={t("root.enrollment.classRequests.rejectTitle", { name: studentName })}
      description={t("root.enrollment.classRequests.rejectDescription")}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="reject-reason"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            {t("root.enrollment.classRequests.reasonLabel")}
          </label>
          <Textarea
            id="reject-reason"
            rows={3}
            maxLength={REASON_MAX}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t("root.enrollment.classRequests.reasonPlaceholder")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <DialogPrimitive.Close asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              {t("root.enrollment.classRequests.cancel")}
            </Button>
          </DialogPrimitive.Close>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            onClick={() => onConfirm(reason.trim())}
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t("root.enrollment.classRequests.confirmReject")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
