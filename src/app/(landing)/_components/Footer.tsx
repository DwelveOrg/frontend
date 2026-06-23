"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import { BRAND_NAME } from "@/constants/brand";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <Link href="/" className="shrink-0">
          <DwelveLogo variant="form" />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-end">
          <span className="text-xs text-[#94a3b8] dark:text-slate-500">
            {`© ${year} ${BRAND_NAME}`}
          </span>
          <Link
            href="/"
            className="text-xs text-[#94a3b8] transition-colors hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400"
          >
            {t("landing.footer.privacy")}
          </Link>
          <Link
            href="/"
            className="text-xs text-[#94a3b8] transition-colors hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400"
          >
            {t("landing.footer.terms")}
          </Link>
          <Link
            href="mailto:support@dwelve.app"
            className="text-xs text-[#94a3b8] transition-colors hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400"
          >
            {t("landing.footer.support")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
