import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BrandButtonVariant = "primary" | "secondary";
export type BrandButtonSize = "sm" | "lg";

type BrandButtonProps = {
  href: string;
  /** "primary" — glowing filled brand button (Sign up). "secondary" — outlined (Log in). */
  variant?: BrandButtonVariant;
  /** "sm" — compact, for the navbar. "lg" — hero / CTA sections. */
  size?: BrandButtonSize;
  /** Append a trailing arrow that nudges on hover. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
};

const BASE =
  "group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-0";

const SIZES: Record<BrandButtonSize, string> = {
  sm: "h-10 px-4 text-[14px] max-[390px]:h-9 max-[390px]:px-3 max-[390px]:text-[13px]",
  lg: "h-12 px-7 text-sm",
};

// Primary keeps a fixed brand-violet fill with WHITE text and a coloured glow in BOTH themes —
// deliberately not the `--primary-foreground` token, which flips to near-black in dark mode.
const VARIANTS: Record<BrandButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#7A5CFF] to-[#6A4FF0] text-white shadow-[0_8px_26px_-6px_rgba(106,79,240,0.65)] hover:-translate-y-0.5 hover:from-[#8268FF] hover:to-[#6F55F2] hover:shadow-[0_14px_38px_-6px_rgba(106,79,240,0.9)]",
  secondary:
    "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:bg-muted hover:text-primary",
};

export default function BrandButton({
  href,
  variant = "primary",
  size = "lg",
  withArrow = false,
  className,
  children,
}: BrandButtonProps) {
  return (
    <Link href={href} className={cn(BASE, SIZES[size], VARIANTS[variant], className)}>
      {children}
      {withArrow ? (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
