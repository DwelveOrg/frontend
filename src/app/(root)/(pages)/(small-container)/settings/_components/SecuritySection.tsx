"use client";

import { History, KeyRound, ShieldEllipsis, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "./SettingsGroup";
import { SettingsRow } from "./SettingsRow";
import { rowDangerActionClassName } from "../_constants";

export function SecuritySection() {
  const { t } = useTranslation();

  return (
    <SettingsGroup label={t("root.settings.security.title")}>
      <SettingsRow
        icon={KeyRound}
        title={t("root.settings.security.changePassword.title")}
        description={t("root.settings.security.changePassword.description")}
        href="/settings/change-password"
      />
      <SettingsRow
        icon={ShieldEllipsis}
        title={t("root.settings.security.twoFactor.title")}
        description={t("root.settings.security.twoFactor.description")}
        soon
      />
      <SettingsRow
        icon={History}
        title={t("root.settings.security.loginHistory.title")}
        description={t("root.settings.security.loginHistory.description")}
        href="/settings/login-history"
      />
      <SettingsRow
        icon={Trash2}
        danger
        title={t("root.settings.security.deleteAccount.title")}
        description={t("root.settings.security.deleteAccount.description")}
        action={
          <button
            type="button"
            onClick={() => toast.error(t("root.settings.security.deleteAccount.unavailable"))}
            className={rowDangerActionClassName}
          >
            {t("root.settings.actions.delete")}
          </button>
        }
      />
    </SettingsGroup>
  );
}
