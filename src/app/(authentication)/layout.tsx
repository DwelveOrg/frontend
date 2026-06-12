"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { AuthLayoutProps } from "./_types";

const Layout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-[#f4f1e9] font-sans text-black lg:grid lg:grid-cols-2">
      {/* Brutalist showcase panel */}
      <aside className="relative hidden overflow-hidden border-r-4 border-black bg-[#4F46E5] lg:block">
        {/* geometric stickers */}
        <div className="absolute right-12 top-12 h-24 w-24 rounded-full border-4 border-black bg-[#FCD34D]" />
        <div className="absolute bottom-24 right-24 h-16 w-16 rotate-12 border-4 border-black bg-[#34D399]" />
        <div className="absolute -bottom-10 -left-10 h-44 w-44 rotate-12 rounded-3xl border-4 border-black bg-[#F472B6]" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-xl border-4 border-black bg-white px-4 py-2 font-serif text-2xl leading-none text-black shadow-[5px_5px_0_0_#000]"
          >
            Dwelve
          </Link>

          <div className="max-w-md">
            <span className="inline-block -rotate-2 rounded-lg border-2 border-black bg-[#FCD34D] px-3 py-1 text-xs font-extrabold uppercase tracking-wide shadow-[3px_3px_0_0_#000]">
              {t("landing.main.badge")}
            </span>
            <h2 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white">
              {t("landing.main.title")}
            </h2>
          </div>

          <p className="max-w-sm rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold shadow-[4px_4px_0_0_#000]">
            <span className="text-[#4F46E5]">2,400+</span> {t("landing.main.socialProof")}
          </p>
        </div>
      </aside>

      {/* Form column */}
      <main className="flex min-h-screen items-center justify-center p-6">{children}</main>
    </div>
  );
};

export default Layout;
