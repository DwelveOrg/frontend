"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type GlassOtpProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Bespoke 6-digit glass OTP built directly on the input-otp primitive. */
export default function GlassOtp({ value, onChange, invalid, autoFocus }: GlassOtpProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={6}
      autoFocus={autoFocus}
      containerClassName="flex w-full justify-center gap-2.5"
      render={({ slots }) => (
        <>
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} invalid={invalid} />
          ))}
        </>
      )}
    />
  );
}

function Slot({ char, isActive, hasFakeCaret, invalid }: SlotProps & { invalid?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex h-14 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-semibold text-white backdrop-blur-md transition-all",
        isActive && "border-white/70 bg-white/20 ring-4 ring-white/15",
        invalid && "border-rose-300/70"
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-white/80 duration-1000" />
        </div>
      )}
    </div>
  );
}
