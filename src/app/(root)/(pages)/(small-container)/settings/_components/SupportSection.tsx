"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpenText, Bug, LifeBuoy, Mail, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SubmitModal } from "../../../_components/ui/SubmitModal";
import { Row } from "../../../_components/layout/Row";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { feedbackModalTitleKeys, settingsActionClassName, supportEmail } from "../_constants";
import type { FeedbackModalKind } from "../_types";

type FeedbackModalActionProps = {
  kind: FeedbackModalKind;
  children: ReactNode;
};

function FeedbackModalAction({ kind, children }: Readonly<FeedbackModalActionProps>) {
  const { t } = useTranslation();

  return (
    <SubmitModal
      className={settingsActionClassName}
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
    <SectionCard
      icon={LifeBuoy}
      title={t("root.settings.support.title")}
      description={t("root.settings.support.description")}
    >
      <Row
        icon={Bug}
        title={t("root.settings.support.reportBug.title")}
        description={t("root.settings.support.reportBug.description")}
        action={<FeedbackModalAction kind="bug">{t("root.settings.actions.send")}</FeedbackModalAction>}
      />
      <Row
        icon={Palette}
        title={t("root.settings.support.requestFeature.title")}
        description={t("root.settings.support.requestFeature.description")}
        action={<FeedbackModalAction kind="feature">{t("root.settings.actions.share")}</FeedbackModalAction>}
      />
      <Row
        icon={Mail}
        title={t("root.settings.support.contactSupport.title")}
        description={t("root.settings.support.contactSupport.description")}
        action={
          <a href={`mailto:${supportEmail}`} className={settingsActionClassName}>
            {t("root.settings.actions.contact")}
          </a>
        }
      />
      <Row
        icon={BookOpenText}
        title={t("root.settings.support.documentation.title")}
        description={t("root.settings.support.documentation.description")}
        action={
          <Link href="/settings/documentation" className={settingsActionClassName}>
            {t("root.settings.actions.readDocs")}
          </Link>
        }
      />
    </SectionCard>
  );
}
