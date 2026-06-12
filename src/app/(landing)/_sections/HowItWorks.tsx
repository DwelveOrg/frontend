"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import { landingSteps } from "../_constants";

export default function HowItWorks() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const header = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12, delayChildren: 0.05 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="how-it-works"
      className="w-full scroll-mt-24 bg-slate-50/70 py-20 md:py-28 dark:bg-white/[0.02]"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-white">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="mt-4 text-base text-[#64748b] dark:text-slate-300">
            {t("landing.howItWorks.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {landingSteps.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.step}
                variants={card}
                className="relative rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#111726]"
              >
                <span className="absolute right-6 top-6 text-3xl font-bold text-slate-100 dark:text-white/10">
                  {item.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a1a2e] dark:text-white">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b] dark:text-slate-300">
                  {t(item.descriptionKey)}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
