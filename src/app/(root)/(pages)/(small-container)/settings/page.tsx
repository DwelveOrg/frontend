"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import {
  BookOpenText,
  Bug,
  Globe,
  History,
  KeyRound,
  Languages,
  LifeBuoy,
  Mail,
  Palette,
  ShieldCheck,
  ShieldEllipsis,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Row } from "../../_components/layout/Row";
import { SectionCard } from "../../_components/layout/SectionCard";
import { toast } from "react-toastify";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitchAlternative from "@/components/ThemeSwitch.alternative";
import {
  containerVariants,
  itemVariants,
} from '../../_constants/index'
import { SubmitModal } from '../../_components/ui/SubmitModal/index'



export default function Settings() {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  const switcherTriggerClass =
    "border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#262626] dark:text-slate-200 dark:hover:bg-white/15";
  const switcherContentClass =
    "border-slate-200/80 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-slate-100";
  const switcherItemClass =
    "text-slate-600 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 dark:text-slate-200 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-white";

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <motion.div variants={itemVariants}>
        <SectionCard
          icon={Palette}
          title={t("root.settings.appearance.title")}
          description={''}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("root.settings.appearance.themeLabel")}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{t("root.settings.appearance.themeHelp")}</p>
              </div>
              <ThemeSwitchAlternative
                compact
                triggerClassName={switcherTriggerClass}
                contentClassName={switcherContentClass}
                itemClassName={switcherItemClass}
              />
            </div>
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SectionCard
          icon={Languages}
          title={t("root.settings.language.title")}
          description={''}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("root.settings.language.primary.title")}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                {t("root.settings.language.primary.description")}
              </p>
            </div>
            <LanguageSwitcher
              compact
              triggerClassName={switcherTriggerClass}
              contentClassName={switcherContentClass}
              itemClassName={switcherItemClass}
            />
          </div>
        </SectionCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SectionCard
          icon={ShieldCheck}
          title={t("root.settings.security.title")}
          description={t("root.settings.security.description")}
        >
          <Row
            icon={KeyRound}
            title={t("root.settings.security.changePassword.title")}
            description={t("root.settings.security.changePassword.description")}
            action={<Link href="/settings/change-password" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">{t("root.settings.actions.change")}</Link>}
          />
          <Row
            icon={ShieldEllipsis}
            title={t("root.settings.security.twoFactor.title")}
            description={t("root.settings.security.twoFactor.description")}
            action={<span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-semibold text-[#0046FF] dark:bg-[#1b2a4a] dark:text-[#9fb8ff]">{t("root.settings.actions.comingSoon")}</span>}
          />
          <Row
            icon={History}
            title={t("root.settings.security.loginHistory.title")}
            description={t("root.settings.security.loginHistory.description")}
            action={<Link href="/settings/login-history" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">{t("root.settings.actions.open")}</Link>}
          />
          <Row
            icon={Trash2}
            danger
            title={t("root.settings.security.deleteAccount.title")}
            description={t("root.settings.security.deleteAccount.description")}
            action={<button onClick={(e) => { e.preventDefault(); toast.error('unable to delete an account'); }} type="button" className="cursor-pointer rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700">{t("root.settings.actions.delete")}</button>}
          />
        </SectionCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SectionCard
          icon={LifeBuoy}
          title={t("root.settings.support.title")}
          description={t("root.settings.support.description")}
        >
          <Row
            icon={Bug}
            title={t("root.settings.support.reportBug.title")}
            description={t("root.settings.support.reportBug.description")}
            action={<SubmitModal className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10" title="Report a bug">{t("root.settings.actions.send")}</SubmitModal>}
          />
          <Row
            icon={Palette}
            title={t("root.settings.support.requestFeature.title")}
            description={t("root.settings.support.requestFeature.description")}
            action={<SubmitModal className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10" title="Request a feature">{t("root.settings.actions.share")}</SubmitModal>}
          />
          <Row
            icon={Mail}
            title={t("root.settings.support.contactSupport.title")}
            description={t("root.settings.support.contactSupport.description")}
            action={<a href="mailto:support@dwelve.app" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">{t("root.settings.actions.contact")}</a>}
          />
          <Row
            icon={BookOpenText}
            title={t("root.settings.support.documentation.title")}
            description={t("root.settings.support.documentation.description")}
            action={<Link href="/settings/documentation" className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">{t("root.settings.actions.readDocs")}</Link>}
          />
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
