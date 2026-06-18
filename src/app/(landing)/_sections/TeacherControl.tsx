"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { Pencil, Trash2, Check } from "lucide-react";

import SectionHeading from "../_components/SectionHeading";
import FeatureBullets from "../_components/FeatureBullets";

const OPTIONS = ["A", "B", "C", "D"] as const;
const CORRECT = "B";

export default function TeacherControl() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const bullets = [
    t("landing.teacherControl.b1"),
    t("landing.teacherControl.b2"),
    t("landing.teacherControl.b3"),
    t("landing.teacherControl.b4"),
    t("landing.teacherControl.b5"),
  ];

  return (
    <section id="teacher-control" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div
          className="order-2 lg:order-1"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <ReviewMock />
        </motion.div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            label={t("landing.teacherControl.label")}
            title={t("landing.teacherControl.title")}
            subtitle={t("landing.teacherControl.subtitle")}
          />
          <FeatureBullets items={bullets} className="mt-8" />
        </div>
      </div>
    </section>
  );
}

function ReviewMock() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Header: draft tag + review status */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
            {t("landing.ai.mock.tag")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t("landing.teacherControl.stepReview")}
          </span>
        </div>

        {/* Question under review */}
        <p className="mt-4 text-sm font-semibold leading-snug text-[#1a1a2e] dark:text-white">
          {t("landing.ai.mock.q1")}
        </p>

        {/* Answer options — the correct one is the teacher's call */}
        <div className="mt-4 space-y-2">
          {OPTIONS.map((opt) => {
            const correct = opt === CORRECT;
            return (
              <div
                key={opt}
                className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                  correct
                    ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                    : "border-slate-200/70 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    correct
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-[#475569] dark:bg-white/10 dark:text-slate-300"
                  }`}
                >
                  {correct ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : opt}
                </span>
                <span
                  className={`h-2 rounded-full ${
                    correct ? "w-2/5 bg-emerald-300 dark:bg-emerald-400/50" : "w-1/2 bg-slate-200 dark:bg-white/10"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Teacher controls */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400">
            <Pencil className="h-3.5 w-3.5" />
            {t("landing.teacherControl.edit")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400">
            <Trash2 className="h-3.5 w-3.5" />
            {t("landing.teacherControl.remove")}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-[#7A5CFF] to-[#6A4FF0] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(106,79,240,0.6)]">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {t("landing.teacherControl.approve")}
          </span>
        </div>
      </div>
    </div>
  );
}
