"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type PillOtpProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Minimal circular 6-digit OTP for the immersive art variant. */
export default function PillOtp({ value, onChange, invalid, autoFocus }: PillOtpProps) {
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
        "relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-base font-semibold text-white backdrop-blur-md transition-all",
        isActive && "border-white/60 bg-white/20",
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
