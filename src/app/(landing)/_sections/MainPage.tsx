"use client";

import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

function MainPage() {
  const { t } = useTranslation();

  return (
    <section className="my-[20px] flex min-h-[60vh] w-full flex-col items-center justify-center" id="feature">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-center text-5xl font-bold text-[#0F2854] max-[615px]:text-4xl dark:text-[white] max-w-[80%]">
            {t("landing.main.title")}
          </h1>
          <p className="max-w-[90%] text-center text-[#0F2854] opacity-70 max-[520px]:max-w-full max-[520px]:text-sm dark:text-[white]">
            {t("landing.main.subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/dashboard" className="cursor-pointer rounded-lg bg-[#0046FF] px-4 py-2 font-medium text-white transition-all duration-600 hover:bg-[#0033CC]">
              {t("landing.main.teacherCta")}
            </Link>
            <Link href="/dashboard" className="flex h-[40px] w-[157.4px] items-center justify-center gap-2 rounded-lg border border-black/10 text-sm font-medium text-[#355181] transition hover:bg-[#f4f8ff] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10">
              {t("landing.main.studentCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainPage;

