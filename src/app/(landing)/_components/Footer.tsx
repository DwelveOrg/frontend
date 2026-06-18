"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import { BRAND_NAME } from "@/constants/brand";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = [
    { label: t("landing.footer.about"), href: "/" },
    { label: t("landing.footer.contact"), href: "/" },
    { label: t("landing.footer.support"), href: "mailto:support@gradeflow.app" },
    { label: t("landing.footer.privacy"), href: "/" },
    { label: t("landing.footer.terms"), href: "/" },
  ];

  return (
    <footer className="w-full border-t border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-[#0b0f1a]/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-8 md:flex-row md:justify-between md:gap-4">
        <Link href="/">
          <DwelveLogo variant="form" />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#64748b] transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-[#94a3b8] dark:text-slate-500">
          {`© ${year} ${BRAND_NAME}. ${t("landing.footer.rights")}`}
        </p>
      </div>
    </footer>
  );
}
