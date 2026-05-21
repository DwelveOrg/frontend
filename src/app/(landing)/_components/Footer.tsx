"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import LogoBlack from "@/public/images/logo-black.png";
import LogoWhite from "@/public/images/logo-white.png";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="mt-20 border-t border-black/10 bg-gradient-to-b from-[#e9f0ff] to-[#dce8ff] dark:border-white/10 dark:from-[#0b1220] dark:to-[#111827]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image src={LogoBlack} alt="Dwelve Logo" width={30} height={30} className="dark:hidden" />
            <Image src={LogoWhite} alt="Dwelve Logo" width={30} height={30} className="hidden dark:block" />
            <p className="text-xl font-bold text-[#0F2854] dark:text-white">Dwelve</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#27416f] dark:text-slate-300">
            {t("landing.footer.description")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0F2854] dark:text-white">{t("landing.footer.quickLinks")}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#27416f] dark:text-slate-300">
            <button
              type="button"
              onClick={() => scrollToSection("feature")}
              className="cursor-pointer text-left hover:text-[#0046FF] dark:hover:text-white"
            >
              {t("landing.footer.home")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="cursor-pointer text-left hover:text-[#0046FF] dark:hover:text-white"
            >
              {t("landing.footer.howItWorks")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="cursor-pointer text-left hover:text-[#0046FF] dark:hover:text-white"
            >
              {t("landing.footer.features")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("accordion")}
              className="cursor-pointer text-left hover:text-[#0046FF] dark:hover:text-white"
            >
              {t("landing.footer.accordion")}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0F2854] dark:text-white">{t("landing.footer.product")}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#27416f] dark:text-slate-300">
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.teacherDashboard")}</Link>
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.studentAccess")}</Link>
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.pricing")}</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0F2854] dark:text-white">{t("landing.footer.support")}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#27416f] dark:text-slate-300">
            <a href="mailto:support@gradeflow.app" className="hover:text-[#0046FF] dark:hover:text-white">
              support@gradeflow.app
            </a>
            <a href="tel:+10000000000" className="hover:text-[#0046FF] dark:hover:text-white">
              +1 (000) 000-0000
            </a>
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.helpCenter")}</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-[#355181] dark:text-slate-400 md:flex-row">
          <p>{`© ${year} Dwelve. ${t("landing.footer.rights")}`}</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.privacy")}</Link>
            <Link href="/" className="hover:text-[#0046FF] dark:hover:text-white">{t("landing.footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

