"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { landingAccordionItems } from "../_constants";

export default function LandingAccordion() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <section id="accordion" className="w-full scroll-mt-24 py-20">
      <motion.div
        className="mx-auto w-full max-w-3xl px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <span className="inline-flex items-center rounded-full border border-[#4F46E5]/20 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5] dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            {t("landing.accordion.label")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-white">
            {t("landing.accordion.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748b] dark:text-slate-300">
            {t("landing.accordion.subtitle")}
          </p>
        </motion.div>

        <motion.div className="w-full" variants={itemVariants}>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {landingAccordionItems.map((item, index) => (
              <motion.div
                key={item.key}
                variants={{
                  hidden: { opacity: 0, x: shouldReduceMotion ? 0 : index % 2 === 0 ? -10 : 10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.04 } },
                }}
              >
                <AccordionItem
                  value={item.key}
                  className="group rounded-2xl border border-slate-200/70 bg-white px-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-300 data-[state=open]:border-[#4F46E5]/30 data-[state=open]:bg-indigo-50/50 data-[state=open]:shadow-[0_12px_34px_rgba(79,70,229,0.10)] dark:border-white/10 dark:bg-[#111726] dark:hover:border-white/20 dark:data-[state=open]:border-indigo-400/40 dark:data-[state=open]:bg-indigo-500/10 dark:data-[state=open]:shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
                >
                  <AccordionTrigger className="py-5 [&>svg]:size-7 [&>svg]:rounded-full [&>svg]:bg-slate-100 [&>svg]:p-1.5 [&>svg]:text-slate-500 [&>svg]:transition-all data-[state=open]:[&>svg]:bg-[#4F46E5] data-[state=open]:[&>svg]:text-white dark:[&>svg]:bg-white/10 dark:[&>svg]:text-slate-300 dark:data-[state=open]:[&>svg]:bg-indigo-500 dark:data-[state=open]:[&>svg]:text-white">
                    {t(item.questionKey)}
                  </AccordionTrigger>
                  <AccordionContent>{t(item.answerKey)}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
