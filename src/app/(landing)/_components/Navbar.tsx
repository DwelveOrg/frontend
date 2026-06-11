"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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
        <Link href="/" className="flex items-center gap-1">
          <span className="font-serif text-[22px] leading-none text-[#1a1a2e] dark:text-white max-[338px]:hidden">
            Dwelve
          </span>
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
            <Link
              href="/login"
              className="login-button flex items-center justify-center text-[14px] font-semibold max-[390px]:text-[12px]"
            >
              {t("landing.nav.login")}
            </Link>
            <Link
              href="/signup"
              className="get-started-button flex h-[40px] items-center justify-center rounded-[10px] px-4 text-[14px] font-semibold max-[390px]:h-[34px] max-[390px]:px-3 max-[390px]:text-[12px]"
            >
              {t("landing.nav.signup")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
