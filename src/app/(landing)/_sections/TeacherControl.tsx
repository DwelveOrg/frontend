"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Pencil, Trash2, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import SectionHeading from "../_components/SectionHeading";
import FeatureBullets from "../_components/FeatureBullets";
import { useMockSequence } from "../_hooks/useMockSequence";

const OPTIONS = ["A", "B", "C", "D"] as const;
const CORRECT = "B";

// Looping "demo video": the teacher scans the AI draft, the answer key lands on
// B, then the question is approved. APPROVED is last so it's the resting frame.
const REVIEWING = 0;
const SELECTING = 1;
const APPROVED = 2;
const TC_PHASES = [1900, 1300, 2800] as const;

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
  const reduce = useReducedMotion();
  const { ref, phase } = useMockSequence(TC_PHASES);

  const reviewing = phase === REVIEWING;
  const approved = phase === APPROVED;
  const decided = phase >= SELECTING; // answer key revealed from the selecting beat on

  // While reviewing, sweep a soft highlight down the options like a reading
  // cursor. The index carries across cycles — harmless, since it's only read
  // while reviewing — which keeps this effect free of synchronous setState.
  const [scan, setScan] = useState(0);
  useEffect(() => {
    if (!reviewing) return;
    const id = setInterval(() => setScan((s) => (s + 1) % OPTIONS.length), 480);
    return () => clearInterval(id);
  }, [reviewing]);

  return (
    <div ref={ref} className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Header: draft tag + review status flipping to approved */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
            {t("landing.ai.mock.tag")}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            {approved ? (
              <motion.span
                key="approved"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22 }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
                {t("landing.teacherControl.stepApprove")}
              </motion.span>
            ) : (
              <motion.span
                key="review"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22 }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-amber-500"
                  animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {t("landing.teacherControl.stepReview")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Question under review */}
        <p className="mt-4 text-sm font-semibold leading-snug text-[#1a1a2e] dark:text-white">
          {t("landing.ai.mock.q1")}
        </p>

        {/* Answer options — the scan settles on B, the teacher's call */}
        <div className="mt-4 space-y-2">
          {OPTIONS.map((opt, i) => {
            const correct = opt === CORRECT;
            const showCorrect = correct && decided;
            const scanning = reviewing && scan === i;
            return (
              <motion.div
                key={opt}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-300",
                  showCorrect
                    ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                    : scanning
                      ? "border-indigo-200 bg-indigo-50/70 dark:border-indigo-400/30 dark:bg-indigo-500/10"
                      : "border-slate-200/70 bg-white dark:border-white/10 dark:bg-white/[0.03]",
                )}
                animate={{ scale: scanning ? 1.015 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors duration-300",
                    showCorrect
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-[#475569] dark:bg-white/10 dark:text-slate-300",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showCorrect ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {opt}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    showCorrect
                      ? "w-2/5 bg-emerald-300 dark:bg-emerald-400/50"
                      : "w-1/2 bg-slate-200 dark:bg-white/10",
                  )}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Teacher controls — Approve confirms with a pulse once the key is set */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400">
            <Pencil className="h-3.5 w-3.5" />
            {t("landing.teacherControl.edit")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400">
            <Trash2 className="h-3.5 w-3.5" />
            {t("landing.teacherControl.remove")}
          </span>
          <motion.span
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-[#7A5CFF] to-[#6A4FF0] px-3 py-1.5 text-xs font-semibold text-white"
            initial={false}
            animate={{
              scale: approved && !reduce ? [1, 1.06, 1] : 1,
              boxShadow: approved
                ? "0 10px 26px -6px rgba(106,79,240,0.75)"
                : "0 8px 20px -6px rgba(106,79,240,0.6)",
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {t("landing.teacherControl.approve")}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
