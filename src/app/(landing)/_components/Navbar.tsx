"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();

  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToAccordion = () => {
    const section = document.getElementById("accordion");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="w-full border-b border-black/10 bg-[#ffffff] p-4 font-[var(--font-inter)] text-[#0b0f19]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <h1 className="navbar-logo-text text-[20px] font-bold max-[390px]:text-[15px] max-[338px]:hidden">
              Dwelve
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ul className="hidden gap-6 min-[620px]:flex">
              <li
                onClick={scrollToFeatures}
                className="navbar-option cursor-pointer text-[15px] font-medium"
              >
                {t("landing.nav.features")}
              </li>
              <li
                onClick={scrollToHowItWorks}
                className="navbar-option cursor-pointer text-[15px] font-medium"
              >
                {t("landing.nav.howItWorks")}
              </li>
              <li
                onClick={scrollToAccordion}
                className="navbar-option cursor-pointer text-[15px] font-medium"
              >
                {t("landing.nav.accordion")}
              </li>
            </ul>
            {/* <span className="text-[#64748b] max-[774px]:hidden">|</span>
            <div className="hidden min-[774px]:block">
              <LanguageSwitcher compact />
            </div>
            <span className="text-[#64748b] max-[774px]:hidden">|</span> */}
            <div className="flex gap-2 min-[390px]:gap-6">
              <Link
                href="/login"
                className="login-button flex items-center justify-center text-[14px] font-bold tracking-normal max-[390px]:text-[12px]"
              >
                {t("landing.nav.login")}
              </Link>
              <Link
                href="/signup"
                className="get-started-button flex h-[40px] w-[90px] items-center justify-center rounded-[10px] text-[14px] font-bold max-[390px]:h-[30px] max-[390px]:w-[60px] max-[390px]:text-[12px]"
              >
                {t("landing.nav.signup")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
