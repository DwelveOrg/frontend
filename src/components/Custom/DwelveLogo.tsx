import { BRAND_NAME, BRAND_WORDMARK_CLASSES } from "@/constants/brand";

export type DwelveLogoVariant = "panel" | "form";

type DwelveLogoProps = {
  /**
   * "panel" — always white; use on dark left panels.
   * "form"  — dark in light mode, white in dark mode; use on nav, footer, and form sides.
   */
  variant?: DwelveLogoVariant;
  className?: string;
};

export default function DwelveLogo({ variant = "panel", className = "" }: DwelveLogoProps) {
  const textClass =
    variant === "panel" ? "text-white" : "text-[#1a1a2e] dark:text-white";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon mark — rounded square with a hollow D glyph */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-400 to-indigo-700 p-[7px]">
        <svg viewBox="0 0 18 20" fill="none" className="h-full w-full" aria-hidden="true">
          {/* Outer D + inner cutout; evenodd makes the hole transparent, revealing the gradient behind */}
          <path
            d="M0 0H8C14 0 17 4 17 10C17 16 14 20 8 20H0V0Z M4 4H7.5C10.5 4 13 6.5 13 10C13 13.5 10.5 16 7.5 16H4V4Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>
      </div>
      {/* Wordmark — driven by brand constants so the style is identical everywhere */}
      <span className={`text-xl ${BRAND_WORDMARK_CLASSES} ${textClass}`}>
        {BRAND_NAME}
      </span>
    </div>
  );
}
