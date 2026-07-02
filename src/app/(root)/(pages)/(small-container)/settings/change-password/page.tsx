"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import Input from "@/components/ui/Input.dark";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="space-y-5">
      <SectionCard
        icon={KeyRound}
        title={t("root.settings.security.changePassword.page.title")}
        description={t("root.settings.security.changePassword.page.description")}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              {t("root.settings.security.changePassword.page.fields.current.label")}
            </label>
            <Input
              id="current-password"
              type="password"
              placeholder={t("root.settings.security.changePassword.page.fields.current.placeholder")}
              value={formValues.currentPassword}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  currentPassword: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              {t("root.settings.security.changePassword.page.fields.new.label")}
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder={t("root.settings.security.changePassword.page.fields.new.placeholder")}
              value={formValues.newPassword}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, newPassword: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              {t("root.settings.security.changePassword.page.fields.confirm.label")}
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder={t("root.settings.security.changePassword.page.fields.confirm.placeholder")}
              value={formValues.confirmPassword}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
            {t("root.settings.security.changePassword.page.hint")}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] active:scale-[0.99]"
          >
            {t("root.settings.security.changePassword.page.actions.submit")}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
