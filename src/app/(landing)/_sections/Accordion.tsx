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

export default function LandingAccordion() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const items = [
    {
      key: "item1",
      question: t("landing.accordion.item1.question"),
      answer: t("landing.accordion.item1.answer"),
    },
    {
      key: "item2",
      question: t("landing.accordion.item2.question"),
      answer: t("landing.accordion.item2.answer"),
    },
    {
      key: "item3",
      question: t("landing.accordion.item3.question"),
      answer: t("landing.accordion.item3.answer"),
    },
    {
      key: "item4",
      question: t("landing.accordion.item4.question"),
      answer: t("landing.accordion.item4.answer"),
    },
    {
      key: "item5",
      question: t("landing.accordion.item5.question"),
      answer: t("landing.accordion.item5.answer"),
    },
    {
      key: "item6",
      question: t("landing.accordion.item6.question"),
      answer: t("landing.accordion.item6.answer"),
    },
    {
      key: "item7",
      question: t("landing.accordion.item7.question"),
      answer: t("landing.accordion.item7.answer"),
    },
    {
      key: "item8",
      question: t("landing.accordion.item8.question"),
      answer: t("landing.accordion.item8.answer"),
    },
  ];

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
        className="mx-auto w-full max-w-5xl px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5] dark:text-indigo-300">
            {t("landing.accordion.label")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-white">
            {t("landing.accordion.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748b] dark:text-slate-300">
            {t("landing.accordion.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-slate-200/70 bg-white px-5 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#111726] dark:shadow-[0_14px_40px_rgba(0,0,0,0.5)]"
          variants={itemVariants}
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <motion.div
                key={item.key}
                variants={{
                  hidden: { opacity: 0, x: shouldReduceMotion ? 0 : index % 2 === 0 ? -10 : 10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.04 } },
                }}
              >
                <AccordionItem value={item.key}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
