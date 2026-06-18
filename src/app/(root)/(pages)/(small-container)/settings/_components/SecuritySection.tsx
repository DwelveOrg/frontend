"use client";

import Link from "next/link";
import { History, KeyRound, ShieldCheck, ShieldEllipsis, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Row } from "../../../_components/layout/Row";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { comingSoonClassName, destructiveActionClassName, settingsActionClassName } from "../_constants";

export function SecuritySection() {
  const { t } = useTranslation();

  return (
    <SectionCard
      icon={ShieldCheck}
      title={t("root.settings.security.title")}
      description={t("root.settings.security.description")}
    >
      <Row
        icon={KeyRound}
        title={t("root.settings.security.changePassword.title")}
        description={t("root.settings.security.changePassword.description")}
        action={
          <Link href="/settings/change-password" className={settingsActionClassName}>
            {t("root.settings.actions.change")}
          </Link>
        }
      />
      <Row
        icon={ShieldEllipsis}
        title={t("root.settings.security.twoFactor.title")}
        description={t("root.settings.security.twoFactor.description")}
        action={<span className={comingSoonClassName}>{t("root.settings.actions.comingSoon")}</span>}
      />
      <Row
        icon={History}
        title={t("root.settings.security.loginHistory.title")}
        description={t("root.settings.security.loginHistory.description")}
        action={
          <Link href="/settings/login-history" className={settingsActionClassName}>
            {t("root.settings.actions.open")}
          </Link>
        }
      />
      <Row
        icon={Trash2}
        danger
        title={t("root.settings.security.deleteAccount.title")}
        description={t("root.settings.security.deleteAccount.description")}
        action={
          <button
            onClick={(event) => {
              event.preventDefault();
              toast.error(t("root.settings.security.deleteAccount.unavailable"));
            }}
            type="button"
            className={destructiveActionClassName}
          >
            {t("root.settings.actions.delete")}
          </button>
        }
      />
    </SectionCard>
  );
}
