"use client";

import type { ExamItem } from "../../../_types";
import { AlarmClock, CalendarDays, Clock, ListChecks, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default function ExamCard({ exam }: { exam: ExamItem }) {
  const { t } = useTranslation();

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b]/90 dark:shadow-[0_22px_60px_rgba(0,0,0,0.3)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-400/20" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              {t(exam.subject)}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{t(exam.title)}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              {t("root.exams.card.labels.instructor")}: {t(exam.instructor)}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={CalendarDays} label={t("root.exams.card.labels.date")} value={`${exam.date} - ${exam.time}`} />
          <InfoRow
            icon={Clock}
            label={t("root.exams.card.labels.duration")}
            value={`${exam.durationMinutes} ${t("root.exams.card.units.minutes")}`}
          />
          <InfoRow
            icon={ListChecks}
            label={t("root.exams.card.labels.questions")}
            value={`${exam.questions} ${t("root.exams.card.units.questions")}`}
          />
          <InfoRow
            icon={GraduationCap}
            label={t("root.exams.card.labels.totalMarks")}
            value={`${exam.totalMarks} ${t("root.exams.card.units.points")}`}
          />
          <InfoRow icon={AlarmClock} label={t("root.exams.card.labels.deadline")} value={exam.deadline} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {t("root.exams.card.labels.passingScore")}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{exam.passingScore}%</p>
          </div>
          <div className="flex items-center gap-2">
            {!exam.completed && (
              <button
                type="button"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t("root.exams.card.actions.start", "Start")}
              </button>
            )}
            <button
              type="button"
              className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                exam.completed
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              }`}
            >
              {t("root.exams.card.actions.details")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
