"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-[#1a1a2e] lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/login"
          aria-label={t("auth.common.backToLogin")}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8] transition hover:text-[#1a1a2e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("auth.common.backToLogin")}
        </Link>
      </div>
      <div className="mt-12 h-px w-10 bg-[#1a1a2e]" />
      <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-[#1a1a2e]">
        {t("auth.passwordReset.title")}
      </h1>
    </div>
  );
};

export default PasswordReset;
