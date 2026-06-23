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
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-secondary px-6 py-16 text-center sm:px-12 sm:py-20"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[34rem] max-w-full rounded-full bg-[radial-gradient(closest-side,rgba(123,97,255,0.22),transparent)] blur-2xl"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            {t("landing.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
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
        </div>
      </motion.div>
    </section>
  );
}
