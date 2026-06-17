"use client";

import Textarea from "@/components/ui/textarea";
import { Modal } from "@/app/(root)/_components/Modal";

interface ModalProps {
  className: string;
  children: React.ReactNode;
  title: string;
}

export function SubmitModal({ className, children, title }: Readonly<ModalProps>) {
  return (


    <Modal className={className} title={title} description='Share the details below so we can follow up quickly.' trigger={children} isSubmit={true}>
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Message</p>
          <Textarea
            placeholder="Describe the issue or idea..."
            className="min-h-[140px] resize-y bg-slate-50 dark:bg-white/10"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Attachment</p>
          <input
            type="file"
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm text-slate-600 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:file:bg-white/10 dark:file:text-slate-200 dark:hover:file:bg-white/15"
          />
        </div>
      </div>
    </Modal>
  );
}
