"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

export default function CallToAction() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="cta" className="w-full scroll-mt-24 px-4 py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl lg:text-[2.75rem] dark:text-white">
          {t("landing.cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#64748b] sm:text-lg dark:text-slate-300">
          {t("landing.cta.subtitle")}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#4F46E5] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.25)] transition-all duration-200 hover:bg-[#4338ca] hover:shadow-[0_14px_30px_rgba(79,70,229,0.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4F46E5]/20"
          >
            {t("landing.cta.primary")}
          </Link>
          <Link
            href="#features"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#4F46E5] dark:text-white dark:hover:text-indigo-300"
          >
            {t("landing.cta.secondary")}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
