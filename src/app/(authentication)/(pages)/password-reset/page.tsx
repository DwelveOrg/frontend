"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
          <span className="font-serif text-2xl leading-none text-white">Dwelve</span>
        </Link>
        <Link
          href="/login"
          aria-label={t("auth.common.backToLanding")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">
        {t("auth.passwordReset.title")}
      </h1>
    </div>
  );
};

export default PasswordReset;
