"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-sm text-center">
      <Link href="/" className="font-serif text-3xl leading-none text-white">
        Dwelve
      </Link>
      <h1 className="mt-9 text-2xl font-semibold tracking-tight text-white">
        {t("auth.passwordReset.title")}
      </h1>
      <Link href="/login" className="mt-6 inline-block text-xs font-medium uppercase tracking-[0.16em] text-white/55 transition hover:text-white">
        {t("auth.common.backToLanding")}
      </Link>
    </div>
  );
};

export default PasswordReset;
