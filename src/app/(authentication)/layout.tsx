"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AuthLayoutProps } from "./_types";

/**
 * Immersive art variant. NOTE: public/images/auth/art.jpg is a stock
 * placeholder standing in for bespoke AI-generated artwork (the image
 * generator was out of credits). Regenerate and swap the file to ship.
 */
const Layout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0f1a] font-sans">
      <Image src="/images/auth/art.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[#0b0f1a]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgba(0,0,0,0.6),transparent_75%)]" />

      <Link
        href="/"
        aria-label={t("auth.common.backToLanding")}
        className="absolute left-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
