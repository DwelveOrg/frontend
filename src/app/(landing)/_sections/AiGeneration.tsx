"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FileText, Check, Sparkles, Pencil, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import SectionHeading from "../_components/SectionHeading";
import FeatureBullets from "../_components/FeatureBullets";
import { useMockSequence } from "../_hooks/useMockSequence";

// Looping "demo video": analyse the upload, draft the questions, land on the
// finished draft, then replay. READY is last so it's the resting/default frame.
const ANALYZING = 0;
const DRAFTING = 1;
const READY = 2;
const AI_PHASES = [1700, 1700, 2800] as const;

export default function AiGeneration() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const bullets = [
    t("landing.ai.b1"),
    t("landing.ai.b2"),
    t("landing.ai.b3"),
    t("landing.ai.b4"),
    t("landing.ai.b5"),
  ];

  return (
    <section id="ai-generation" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            label={t("landing.ai.label")}
            title={t("landing.ai.title")}
            subtitle={t("landing.ai.subtitle")}
          />
          <FeatureBullets items={bullets} className="mt-8" />
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <AiMock />
        </motion.div>
      </div>
    </section>
  );
}

function AiMock() {
  const { t } = useTranslation();
  const { ref, phase } = useMockSequence(AI_PHASES);

  const analyzing = phase === ANALYZING;
  const drafting = phase === DRAFTING;
  const ready = phase === READY;

  const statusLabel = analyzing
    ? t("landing.ai.mock.analyzing")
    : drafting
      ? t("landing.ai.mock.drafting")
      : t("landing.ai.mock.ready");

  const questions = [t("landing.ai.mock.q1"), t("landing.ai.mock.q2")];

  return (
    <div ref={ref} className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Uploaded source file — spinner while analysing, then a settled check */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1a1a2e] dark:text-white">
              {t("landing.ai.mock.file")}
            </p>
            <p className="text-xs text-[#94a3b8] dark:text-slate-400">{t("landing.ai.mock.meta")}</p>
          </div>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {analyzing ? (
                <motion.span
                  key="spin"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[#7B61FF] dark:bg-white/10 dark:text-indigo-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </motion.span>
              ) : (
                <motion.span
                  key="check"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 480, damping: 18 }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Drafting indicator — label crossfades per phase, bar fills then turns done */}
        <div className="mt-4 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-[#7B61FF]" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={statusLabel}
              className="whitespace-nowrap text-xs font-medium text-[#64748b] dark:text-slate-400"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {statusLabel}
            </motion.span>
          </AnimatePresence>
          <span className="relative ml-1 h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <motion.span
              className={cn(
                "absolute inset-y-0 left-0 overflow-hidden rounded-full",
                ready
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-gradient-to-r from-[#8E78FF] to-[#6A4FF0]",
              )}
              initial={false}
              animate={{ width: ready ? "100%" : drafting ? "90%" : "56%" }}
              transition={{ duration: ready ? 0.5 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {!ready ? <span className="mock-shimmer absolute inset-0" /> : null}
            </motion.span>
          </span>
        </div>

        {/* Draft questions header — the AI tag pops once the draft is ready */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-bold text-[#1a1a2e] dark:text-white">
            {t("landing.ai.mock.heading")}
          </p>
          <motion.span
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300"
            initial={false}
            animate={{ opacity: ready ? 1 : 0.4, scale: ready ? 1 : 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <Sparkles className="h-3 w-3" />
            {t("landing.ai.mock.tag")}
          </motion.span>
        </div>

        {/* Drafted question rows — skeleton shimmer resolves into the real text */}
        <div className="mt-3 space-y-2.5">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-[#475569] dark:bg-white/10 dark:text-slate-300">
                {i + 1}
              </span>
              <div className="relative min-h-[2.25rem] min-w-0 flex-1">
                <p
                  className="text-[13px] leading-snug text-[#475569] transition-opacity duration-500 dark:text-slate-300"
                  style={{ opacity: ready ? 1 : 0, transitionDelay: ready ? `${i * 110}ms` : "0ms" }}
                >
                  {q}
                </p>
                <div
                  aria-hidden
                  className="absolute inset-0 flex flex-col justify-center gap-1.5 transition-opacity duration-300"
                  style={{ opacity: ready ? 0 : 1 }}
                >
                  <span className="mock-shimmer h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-white/10" />
                  <span className="mock-shimmer h-2.5 w-3/5 rounded-full bg-slate-200/80 dark:bg-white/10" />
                </div>
              </div>
              <motion.span
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400"
                initial={false}
                animate={{ opacity: ready ? 1 : 0.3 }}
                transition={{ duration: 0.4, delay: ready ? i * 0.11 + 0.1 : 0 }}
              >
                <Pencil className="h-3 w-3" />
                {t("landing.ai.mock.action")}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
