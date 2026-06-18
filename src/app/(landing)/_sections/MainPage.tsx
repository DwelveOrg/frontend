"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import BrandButton from "@/components/Custom/BrandButton";

const AVATAR_COLORS = ["bg-indigo-300", "bg-emerald-300", "bg-amber-300", "bg-rose-300"];

const CHART_BARS = [
  { height: "42%", color: "bg-indigo-200 dark:bg-indigo-400/40" },
  { height: "60%", color: "bg-indigo-300 dark:bg-indigo-400/60" },
  { height: "34%", color: "bg-indigo-200 dark:bg-indigo-400/40" },
  { height: "78%", color: "bg-indigo-400 dark:bg-indigo-400/80" },
  { height: "52%", color: "bg-indigo-300 dark:bg-indigo-400/60" },
  { height: "94%", color: "bg-[#4F46E5]" },
];

const INSTITUTIONS = ["Stanford", "MIT", "Harvard", "Oxford", "Yale"];

function MainPage() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <section id="home" className="w-full scroll-mt-24 px-4 pb-12 pt-14 md:pt-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <motion.div className="flex flex-col items-start text-left" {...fade(0)}>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
            {t("landing.main.badge")}
          </span>

          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-[#1a1a2e] sm:text-5xl lg:text-[3.4rem] dark:text-white">
            {t("landing.main.title")}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#64748b] sm:text-lg dark:text-slate-300">
            {t("landing.main.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BrandButton href="/signup" variant="primary" size="lg">
              {t("landing.main.primaryCta")}
            </BrandButton>
            <BrandButton href="/login" variant="secondary" size="lg" withArrow>
              {t("landing.main.secondaryCta")}
            </BrandButton>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {AVATAR_COLORS.map((color, i) => (
                <span
                  key={i}
                  className={`h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0b0f1a] ${color}`}
                />
              ))}
            </div>
            <p className="text-sm text-[#64748b] dark:text-slate-400">
              <span className="font-semibold text-[#1a1a2e] dark:text-white">2,400+</span>{" "}
              {t("landing.main.socialProof")}
            </p>
          </div>
        </motion.div>

        {/* Right: dashboard preview */}
        <motion.div className="relative" {...fade(0.15)}>
          <div className="rounded-[28px] bg-slate-100/70 p-3 sm:p-5 dark:bg-white/5">
            <div className="rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:bg-[#111726] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-[#1a1a2e] dark:text-white">
                  {t("landing.main.mockup.title")}
                </p>
                <p className="text-xs text-[#94a3b8] dark:text-slate-400">
                  {t("landing.main.mockup.welcome")}, Sarah
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <StatCard label={t("landing.main.mockup.courses")} value="6" />
                <StatCard label={t("landing.main.mockup.grade")} value="A-" />
                <StatCard label={t("landing.main.mockup.tasks")} value="4" accent />
              </div>

              <div className="mt-3 flex h-36 items-end justify-between gap-2.5 rounded-xl bg-indigo-50/70 p-4 dark:bg-indigo-500/10">
                {CHART_BARS.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-md ${bar.color}`}
                    style={{ height: bar.height }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trusted-by institutions */}
      <div className="mx-auto mt-20 w-full max-w-5xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94a3b8] dark:text-slate-500">
          {t("landing.main.trustedBy")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {INSTITUTIONS.map((name) => (
            <span
              key={name}
              className="text-lg font-bold text-slate-300 transition-colors hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-white/5">
      <p className="text-[11px] font-medium text-[#94a3b8] dark:text-slate-400">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          accent ? "text-[#4F46E5] dark:text-indigo-300" : "text-[#1a1a2e] dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default MainPage;
