"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { loginHistoryItems } from "./_constants";
import { LoginHistoryRow } from "./_components/LoginHistoryRow";

export default function LoginHistory() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <SectionCard
        icon={ShieldCheck}
        title={t("root.settings.loginHistory.page.title")}
        description={t("root.settings.loginHistory.page.description")}
      >
        <div className="space-y-3">
          {loginHistoryItems.map((item) => (
            <LoginHistoryRow key={item.id} item={item} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
