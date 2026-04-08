"use client";



import React from "react";
import { ChartNoAxesCombined, Share2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import LiquidCard from "../_components/cards/LiquidCard";

export default function HowItWorks() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
        delayChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="how-it-works" className="my-[20px] w-full scroll-mt-24">
      <motion.div
        className="container mx-auto flex flex-col items-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="text-4xl font-bold capitalize text-[#0F2854] dark:text-[white]">
          {t("landing.howItWorks.title")}
        </h1>
        <p className="mt-6 text-[#0F2854] opacity-70 dark:text-[white]">
          {t("landing.howItWorks.subtitle")}
        </p>
        <motion.div
          className="mt-10 grid max-w-[90%] gap-6 md:grid-cols-3"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={cardVariants}>
            <LiquidCard>
            <div className="flex h-[100px] w-full flex-col items-center justify-center">
              <h2 className="mt-2 flex items-center gap-[7px] text-[30px] font-bold text-[#0F2854] max-[1020px]:text-[25px] dark:text-white">
                {t("landing.howItWorks.createTitle")} <ShieldCheck />
              </h2>
              <p className="mt-3 text-center text-sm text-slate-700 max-[1030px]:text-[12px] dark:text-slate-200">{t("landing.howItWorks.createDesc")}</p>
            </div>
            </LiquidCard>
          </motion.div>
          <motion.div variants={cardVariants}>
            <LiquidCard>
            <div className="flex h-[100px] w-full flex-col items-center justify-center">
              <h2 className="mt-2 flex items-center gap-[7px] text-[30px] font-bold text-[#0F2854] max-[1020px]:text-[25px] dark:text-white">
                {t("landing.howItWorks.shareTitle")} <Share2 />
              </h2>
              <p className="mt-3 text-center text-sm text-slate-700 max-[1030px]:text-[12px] dark:text-slate-200">{t("landing.howItWorks.shareDesc")}</p>
            </div>
            </LiquidCard>
          </motion.div>
          <motion.div variants={cardVariants}>
            <LiquidCard>
            <div className="flex h-[100px] w-full flex-col items-center justify-center">
              <h2 className="mt-2 flex items-center gap-[7px] text-[30px] font-bold text-[#0F2854] max-[1030px]:text-[25px] dark:text-white">
                {t("landing.howItWorks.resultsTitle")} <ChartNoAxesCombined />
              </h2>
              <p className="mt-3 text-center text-sm text-slate-700 max-[1030px]:text-[12px] dark:text-slate-200">{t("landing.howItWorks.resultsDesc")}</p>
            </div>
            </LiquidCard>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

