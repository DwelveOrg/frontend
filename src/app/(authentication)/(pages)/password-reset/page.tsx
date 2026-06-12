"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111726] dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]">
        <Link
          href="/login"
          aria-label={t("auth.common.backToLogin")}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748b] transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#1a1a2e] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <Link href="/" className="inline-flex items-center">
          <span className="font-serif text-[22px] leading-none text-[#1a1a2e] dark:text-white">
            Dwelve
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
          {t("auth.passwordReset.title")}
        </h2>
      </div>
    </section>
  );
};

export default PasswordReset;
