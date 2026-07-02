"use client";

import Textarea from "@/components/ui/textarea";
import { Modal } from "@/app/(root)/_components/Modal";

interface SubmitModalProps {
  className: string;
  children: React.ReactNode;
  title: string;
  description: string;
  messageLabel: string;
  attachmentLabel: string;
  placeholder: string;
  closeLabel: string;
  submitLabel: string;
}

export function SubmitModal({
  className,
  children,
  title,
  description,
  messageLabel,
  attachmentLabel,
  placeholder,
  closeLabel,
  submitLabel,
}: Readonly<SubmitModalProps>) {
  return (
    <Modal
      className={className}
      title={title}
      description={description}
      trigger={children}
      isSubmit={true}
      closeLabel={closeLabel}
      submitLabel={submitLabel}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--foreground)]">{messageLabel}</p>
          <Textarea
            placeholder={placeholder}
            className="min-h-[140px] resize-y bg-[var(--muted)]"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--foreground)]">{attachmentLabel}</p>
          <input
            type="file"
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--muted-foreground)] outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--muted)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--foreground)] hover:file:bg-[color-mix(in_srgb,var(--primary)_14%,var(--muted))]"
          />
        </div>
      </div>
    </Modal>
  );
}
