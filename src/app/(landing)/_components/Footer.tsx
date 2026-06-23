"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import DwelveLogo from "@/components/Custom/DwelveLogo";
import { BRAND_NAME } from "@/constants/brand";

const SUPPORT_EMAIL = "support@dwelve.app";

const FOOTER_TABS = [
  { href: "#ai-generation", key: "landing.nav.aiDrafting" },
  { href: "#features", key: "landing.footer.features" },
  { href: "#how-it-works", key: "landing.footer.howItWorks" },
  { href: "#analytics", key: "landing.nav.analytics" },
  { href: "#accordion", key: "landing.footer.accordion" },
] as const;

const FOOTER_ACTIONS = [
  { href: "/login", key: "landing.nav.login" },
  { href: "/signup", key: "landing.nav.signup" },
  { href: `mailto:${SUPPORT_EMAIL}`, key: "landing.footer.support" },
  { href: `mailto:${SUPPORT_EMAIL}?subject=Privacy`, key: "landing.footer.privacy" },
  { href: `mailto:${SUPPORT_EMAIL}?subject=Terms`, key: "landing.footer.terms" },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const tabClass =
    "inline-flex h-9 cursor-pointer items-center rounded-full border border-border/70 bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
  const linkClass =
    "cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/"
              aria-label={t("landing.footer.home")}
              className="inline-flex w-fit cursor-pointer rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <DwelveLogo variant="form" />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("landing.footer.description")}
            </p>
          </div>

          <nav aria-label={t("landing.footer.quickLinks")}>
            <ul className="flex flex-wrap gap-2">
              {FOOTER_TABS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={tabClass}>
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs leading-relaxed text-muted-foreground">
            {`\u00A9 ${year} ${BRAND_NAME}. ${t("landing.footer.rights")}`}
          </span>
          <nav aria-label={t("landing.footer.product")}>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {FOOTER_ACTIONS.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("mailto:") ? (
                    <a href={item.href} className={linkClass}>
                      {t(item.key)}
                    </a>
                  ) : (
                    <Link href={item.href} className={linkClass}>
                      {t(item.key)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
