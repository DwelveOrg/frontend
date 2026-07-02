"use client";

import { motion, useReducedMotion } from "motion/react";
import { PreferencesSection } from "./_components/PreferencesSection";
import { SecuritySection } from "./_components/SecuritySection";
import { SupportSection } from "./_components/SupportSection";

export default function Settings() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >
      <PreferencesSection />
      <SecuritySection />
      <SupportSection />
    </motion.div>
  );
}
