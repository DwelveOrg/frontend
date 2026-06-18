"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "../../_constants";
import { AppearanceSection } from "./_components/AppearanceSection";
import { LanguageSection } from "./_components/LanguageSection";
import { SecuritySection } from "./_components/SecuritySection";
import { SupportSection } from "./_components/SupportSection";

export default function Settings() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={itemVariants}>
        <AppearanceSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <LanguageSection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SecuritySection />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SupportSection />
      </motion.div>
    </motion.div>
  );
}
