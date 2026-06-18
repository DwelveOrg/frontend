"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { Building2, GraduationCap, Smartphone, type LucideIcon } from "lucide-react";

import SectionHeading from "../_components/SectionHeading";

type Role = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** The teacher card is the primary user — highlighted to break grid uniformity. */
  featured?: boolean;
};

export default function Roles() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const roles: Role[] = [
    {
      icon: Building2,
      title: t("landing.roles.adminTitle"),
      description: t("landing.roles.adminDesc"),
    },
    {
      icon: GraduationCap,
      title: t("landing.roles.teacherTitle"),
      description: t("landing.roles.teacherDesc"),
      featured: true,
    },
    {
      icon: Smartphone,
      title: t("landing.roles.studentTitle"),
      description: t("landing.roles.studentDesc"),
    },
  ];

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const card = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="roles" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading
          label={t("landing.roles.label")}
          title={t("landing.roles.title")}
          subtitle={t("landing.roles.subtitle")}
        />

        <motion.div
          className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <motion.article
                key={role.title}
                variants={card}
                className={
                  role.featured
                    ? "relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#7A5CFF] to-[#6A4FF0] p-7 text-white shadow-[0_24px_50px_-12px_rgba(106,79,240,0.55)] lg:-translate-y-3"
                    : "rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111726]"
                }
              >
                {role.featured ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                  />
                ) : null}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    role.featured
                      ? "bg-white/15 text-white"
                      : "bg-indigo-100 text-[#4F46E5] dark:bg-indigo-500/15 dark:text-indigo-300"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className={`mt-5 text-lg font-bold ${role.featured ? "text-white" : "text-[#1a1a2e] dark:text-white"}`}
                >
                  {role.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    role.featured ? "text-white/85" : "text-[#64748b] dark:text-slate-300"
                  }`}
                >
                  {role.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
