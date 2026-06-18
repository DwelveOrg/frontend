"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import BrandButton from "@/components/Custom/BrandButton";

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
          <BrandButton href="/signup" variant="primary" size="lg">
            {t("landing.cta.primary")}
          </BrandButton>
          <BrandButton href="#how-it-works" variant="secondary" size="lg" withArrow>
            {t("landing.cta.secondary")}
          </BrandButton>
        </div>
      </motion.div>
    </section>
  );
}
