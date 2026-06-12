"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full bg-[#f7f6f3] font-sans text-[#1a1a2e] lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Photo panel with diagonal edge */}
      <aside
        className="relative hidden overflow-hidden lg:block"
        style={{ clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)" }}
      >
        <Image src="/images/auth/classroom.jpg" alt="" fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a2e]/90 via-[#1a1a2e]/45 to-[#4F46E5]/35" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Link href="/" className="font-serif text-2xl leading-none">
            Dwelve
          </Link>
          <div className="max-w-md pr-[14%]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
              {t("landing.main.trustedBy")}
            </p>
            <h2 className="mt-5 text-4xl font-bold leading-[1.06] tracking-tight xl:text-5xl">
              {t("landing.main.title")}
            </h2>
          </div>
          <p className="pr-[14%] text-sm text-white/55">{t("landing.main.subtitle")}</p>
        </div>
      </aside>

      {/* Form column */}
      <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
