"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { FileText, Check, Sparkles, Pencil } from "lucide-react";

import SectionHeading from "../_components/SectionHeading";
import FeatureBullets from "../_components/FeatureBullets";

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

  const questions = [t("landing.ai.mock.q1"), t("landing.ai.mock.q2")];

  return (
    <div className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Uploaded source file */}
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
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>

        {/* Drafting indicator */}
        <div className="mt-4 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-[#7B61FF]" />
          <span className="text-xs font-medium text-[#64748b] dark:text-slate-400">
            {t("landing.ai.mock.drafting")}
          </span>
          <span className="relative ml-1 h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <span className="absolute inset-y-0 left-0 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#8E78FF] to-[#6A4FF0]" />
          </span>
        </div>

        {/* Draft questions header */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-bold text-[#1a1a2e] dark:text-white">
            {t("landing.ai.mock.heading")}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
            <Sparkles className="h-3 w-3" />
            {t("landing.ai.mock.tag")}
          </span>
        </div>

        {/* Drafted question rows */}
        <div className="mt-3 space-y-2.5">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-[#475569] dark:bg-white/10 dark:text-slate-300">
                {i + 1}
              </span>
              <p className="flex-1 text-[13px] leading-snug text-[#475569] dark:text-slate-300">{q}</p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-[#64748b] dark:border-white/10 dark:text-slate-400">
                <Pencil className="h-3 w-3" />
                {t("landing.ai.mock.action")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
