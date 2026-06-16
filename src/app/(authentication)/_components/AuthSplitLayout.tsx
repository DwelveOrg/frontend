import Image from "next/image";
import type { ReactNode } from "react";

type AuthSplitLayoutProps = {
  imageSrc: string;
  imageAlt: string;
  /** Content rendered inside the left photo panel (logo, cards, social proof). */
  panelContent: ReactNode;
  /** The form / right-side content. */
  children: ReactNode;
};

export default function AuthSplitLayout({
  imageSrc,
  imageAlt,
  panelContent,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left visual panel (hidden below lg) ── */}
      <div className="relative hidden lg:flex lg:w-[44%] xl:w-[46%] flex-col overflow-hidden">
        {/* Photo */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          priority
          sizes="46vw"
        />
        {/* Rich indigo overlay — brand-primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b]/92 via-[#3730a3]/78 to-[#312e81]/88" />
        {/* Subtle dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.055]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-dots)" />
          </svg>
        </div>
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1e1b4b]/60 to-transparent" />
        {/* Panel content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          {panelContent}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white dark:bg-[#0b0f1a]">
        {children}
      </div>
    </div>
  );
}
