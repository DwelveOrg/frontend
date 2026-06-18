"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import BrandButton from "@/components/Custom/BrandButton";

export default function Navbar() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { label: t("landing.nav.features"), target: "features" },
    { label: t("landing.nav.howItWorks"), target: "how-it-works" },
    { label: t("landing.nav.accordion"), target: "accordion" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0f1a]/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/">
          <DwelveLogo variant="form" />
        </Link>

        <div className="flex items-center gap-2 min-[620px]:gap-6">
          <ul className="hidden gap-7 min-[620px]:flex">
            {navItems.map((item) => (
              <li key={item.target}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.target)}
                  className="cursor-pointer text-[15px] font-medium text-[#64748b] transition-colors hover:text-[#1a1a2e] dark:text-slate-300 dark:hover:text-white"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 min-[390px]:gap-3">
            <BrandButton href="/login" variant="secondary" size="sm">
              {t("landing.nav.login")}
            </BrandButton>
            <BrandButton href="/signup" variant="primary" size="sm">
              {t("landing.nav.signup")}
            </BrandButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
