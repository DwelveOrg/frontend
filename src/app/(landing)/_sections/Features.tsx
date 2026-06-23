"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Hourglass,
  MonitorSmartphone,
  FileQuestion,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  tile: string;
};

export default function Features() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const features: Feature[] = [
    {
      title: t("landing.features.instantGradingTitle"),
      description: t("landing.features.instantGradingDesc"),
      icon: TrendingUp,
      tile: "bg-indigo-100 text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300",
    },
    {
      title: t("landing.features.timedExamsTitle"),
      description: t("landing.features.timedExamsDesc"),
      icon: Hourglass,
      tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    {
      title: t("landing.features.insightsTitle"),
      description: t("landing.features.insightsDesc"),
      icon: BarChart3,
      tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    },
    {
      title: t("landing.features.anyDeviceTitle"),
      description: t("landing.features.anyDeviceDesc"),
      icon: MonitorSmartphone,
      tile: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
    },
    {
      title: t("landing.features.questionBankTitle"),
      description: t("landing.features.questionBankDesc"),
      icon: FileQuestion,
      tile: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
    },
  ];

  const header = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08, delayChildren: 0.05 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="features" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5] dark:text-indigo-300">
            {t("landing.features.label")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-white">
            {t("landing.features.title")}
          </h2>
          <p className="mt-4 text-base text-[#64748b] dark:text-slate-300">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={card}
                className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111726] dark:hover:border-white/20"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tile}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a1a2e] dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b] dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
