"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import DwelveLogo from "@/components/Custom/DwelveLogo";
import { BRAND_NAME } from "@/constants/brand";

const SUPPORT_EMAIL = "support@dwelve.app";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const actionClass =
    "text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm";
  const legalClass =
    "text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm";

  return (
    <footer className="w-full border-t border-border bg-background">
      {/* Primary strip */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <Link
          href="/"
          aria-label={t("landing.footer.home")}
          className="inline-flex w-fit rounded-md outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <DwelveLogo variant="form" />
        </Link>

        <nav aria-label={t("landing.footer.product")} className="flex items-center gap-6">
          <Link href="/login" className={actionClass}>
            {t("landing.nav.login")}
          </Link>
          <Link href="/signup" className={actionClass}>
            {t("landing.nav.signup")}
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={actionClass}>
            {t("landing.footer.support")}
          </a>
        </nav>
      </div>

      {/* Legal strip */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-muted-foreground">
          {`© ${year} ${BRAND_NAME}. ${t("landing.footer.rights")}`}
        </span>

        <div className="flex items-center gap-5">
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Privacy`} className={legalClass}>
            {t("landing.footer.privacy")}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Terms`} className={legalClass}>
            {t("landing.footer.terms")}
          </a>
        </div>
      </div>
    </footer>
  );
}
