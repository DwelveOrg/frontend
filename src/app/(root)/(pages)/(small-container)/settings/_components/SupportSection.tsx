"use client";

import type { ReactNode } from "react";
import { BookOpenText, Bug, Mail, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SubmitModal } from "../../../_components/ui/SubmitModal";
import { SettingsGroup } from "./SettingsGroup";
import { SettingsRow } from "./SettingsRow";
import { feedbackModalTitleKeys, rowActionClassName, supportEmail } from "../_constants";
import type { FeedbackModalKind } from "../_types";

function FeedbackModalAction({ kind, children }: Readonly<{ kind: FeedbackModalKind; children: ReactNode }>) {
  const { t } = useTranslation();

  return (
    <SubmitModal
      className={rowActionClassName}
      title={t(feedbackModalTitleKeys[kind])}
      description={t("root.settings.support.feedbackModal.description")}
      messageLabel={t("root.settings.support.feedbackModal.messageLabel")}
      attachmentLabel={t("root.settings.support.feedbackModal.attachmentLabel")}
      placeholder={t("root.settings.support.feedbackModal.placeholder")}
      closeLabel={t("root.settings.support.feedbackModal.close")}
      submitLabel={t("root.settings.support.feedbackModal.submit")}
    >
      {children}
    </SubmitModal>
  );
}

export function SupportSection() {
  const { t } = useTranslation();

  return (
    <SettingsGroup label={t("root.settings.support.title")}>
      <SettingsRow
        icon={Bug}
        title={t("root.settings.support.reportBug.title")}
        description={t("root.settings.support.reportBug.description")}
        action={<FeedbackModalAction kind="bug">{t("root.settings.actions.send")}</FeedbackModalAction>}
      />
      <SettingsRow
        icon={Sparkles}
        title={t("root.settings.support.requestFeature.title")}
        description={t("root.settings.support.requestFeature.description")}
        action={<FeedbackModalAction kind="feature">{t("root.settings.actions.share")}</FeedbackModalAction>}
      />
      <SettingsRow
        icon={Mail}
        title={t("root.settings.support.contactSupport.title")}
        description={t("root.settings.support.contactSupport.description")}
        action={
          <a href={`mailto:${supportEmail}`} className={rowActionClassName}>
            {t("root.settings.actions.contact")}
          </a>
        }
      />
      <SettingsRow
        icon={BookOpenText}
        title={t("root.settings.support.documentation.title")}
        description={t("root.settings.support.documentation.description")}
        href="/settings/documentation"
      />
    </SettingsGroup>
  );
}
