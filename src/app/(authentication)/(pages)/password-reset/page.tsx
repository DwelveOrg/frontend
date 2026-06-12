"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-7 shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-black lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/login"
          aria-label={t("auth.common.backToLogin")}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      <h1 className="mt-6 text-3xl font-black uppercase tracking-tight text-black">
        {t("auth.passwordReset.title")}
      </h1>
    </div>
  );
};

export default PasswordReset;
