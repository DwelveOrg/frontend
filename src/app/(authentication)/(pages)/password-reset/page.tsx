"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/[0.08] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-white">
          Dwelve
        </Link>
        <Link
          href="/login"
          aria-label={t("auth.common.backToLanding")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
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
