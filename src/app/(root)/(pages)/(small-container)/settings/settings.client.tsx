"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/app/(root)/_components/PageHeader";
import type { SessionUser } from "@/app/(root)/_utils/getUser";
import { AccountCard } from "./_components/AccountCard";
import { PreferencesSection } from "./_components/PreferencesSection";
import { SecuritySection } from "./_components/SecuritySection";
import { SupportSection } from "./_components/SupportSection";

export default function SettingsClient({ user }: { user: SessionUser | null }) {
  const reduce = useReducedMotion();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-7"
    >
      <PageHeader
        title={t("root.pages.settings")}
        subtitle={t("root.settings.subtitle")}
      />
      <AccountCard user={user} />
      <PreferencesSection />
      <SecuritySection />
      <SupportSection />
    </motion.div>
  );
}
