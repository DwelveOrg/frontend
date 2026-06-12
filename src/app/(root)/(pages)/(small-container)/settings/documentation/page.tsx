"use client";

import { BookOpenText } from "lucide-react";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { useTranslation } from "react-i18next";

export default function Documentation() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <SectionCard
        icon={BookOpenText}
        title={t("root.settings.documentation.page.title")}
        description={t("root.settings.documentation.page.description")}
      >
        <div className="space-y-4 font-sans text-[20px] text-slate-600 dark:text-slate-300">
          <p>{t("root.settings.documentation.page.paragraphs.0")}</p>
          <p>{t("root.settings.documentation.page.paragraphs.1")}</p>
          <p>{t("root.settings.documentation.page.paragraphs.2")}</p>
          <p>{t("root.settings.documentation.page.paragraphs.3")}</p>
        </div>
      </SectionCard>
    </div>
  );
}
