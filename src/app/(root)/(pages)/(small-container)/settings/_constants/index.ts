import type { FeedbackModalKind, SwitcherClassNames } from "../_types";

export const switcherClassNames: SwitcherClassNames = {
  trigger:
    "border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#262626] dark:text-slate-200 dark:hover:bg-white/15",
  content:
    "border-slate-200/80 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-slate-100",
  item:
    "text-slate-600 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 dark:text-slate-200 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-white",
};

export const settingsActionClassName =
  "cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10";

export const destructiveActionClassName =
  "cursor-pointer rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700";

export const comingSoonClassName =
  "rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-semibold text-[#0046FF] dark:bg-[#1b2a4a] dark:text-[#9fb8ff]";

export const supportEmail = "support@gradeflow.app";

export const feedbackModalTitleKeys: Record<FeedbackModalKind, string> = {
  bug: "root.settings.support.reportBug.modalTitle",
  feature: "root.settings.support.requestFeature.modalTitle",
};
