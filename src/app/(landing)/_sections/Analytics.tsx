"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { BarChart3, TrendingUp } from "lucide-react";

import SectionHeading from "../_components/SectionHeading";
import FeatureBullets from "../_components/FeatureBullets";

const BARS = ["38%", "62%", "48%", "82%", "55%", "70%", "94%"];

export default function Analytics() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const bullets = [
    t("landing.analytics.b1"),
    t("landing.analytics.b2"),
    t("landing.analytics.b3"),
    t("landing.analytics.b4"),
    t("landing.analytics.b5"),
    t("landing.analytics.b6"),
  ];

  return (
    <section id="analytics" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            label={t("landing.analytics.label")}
            title={t("landing.analytics.title")}
            subtitle={t("landing.analytics.subtitle")}
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
          <AnalyticsMock />
        </motion.div>
      </div>
    </section>
  );
}

function AnalyticsMock() {
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
      <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#1a1a2e] dark:text-white">
            {t("landing.analytics.mock.title")}
          </p>
          <BarChart3 className="h-4 w-4 text-[#94a3b8] dark:text-slate-500" />
        </div>

        {/* Headline stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
            <p className="text-[11px] font-medium text-[#94a3b8] dark:text-slate-400">
              {t("landing.analytics.mock.average")}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">82%</p>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                8%
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
            <p className="text-[11px] font-medium text-[#94a3b8] dark:text-slate-400">
              {t("landing.analytics.mock.submitted")}
            </p>
            <p className="mt-1 text-2xl font-bold text-[#1a1a2e] dark:text-white">
              24<span className="text-base font-semibold text-[#94a3b8] dark:text-slate-500">/28</span>
            </p>
          </div>
        </div>

        {/* Score distribution */}
        <div className="mt-3 flex h-28 items-end justify-between gap-2 rounded-xl bg-indigo-50/70 p-4 dark:bg-indigo-500/10">
          {BARS.map((height, i) => (
            <div
              key={i}
              className={`w-full rounded-md ${
                i === BARS.length - 1
                  ? "bg-[#4F46E5]"
                  : "bg-indigo-300 dark:bg-indigo-400/50"
              }`}
              style={{ height }}
            />
          ))}
        </div>

        {/* Most-missed question */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#94a3b8] dark:text-slate-400">
              {t("landing.analytics.mock.missedLabel")}
            </p>
            <p className="truncate text-sm font-semibold text-[#1a1a2e] dark:text-white">
              {t("landing.analytics.mock.missedQuestion")}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            {t("landing.analytics.mock.missedRate")}
          </span>
        </div>
      </div>
    </div>
  );
}
