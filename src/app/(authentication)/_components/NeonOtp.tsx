"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type NeonOtpProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Dark neon 6-digit OTP — glass cells with indigo glow on the active slot. */
export default function NeonOtp({ value, onChange, invalid, autoFocus }: NeonOtpProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={6}
      autoFocus={autoFocus}
      containerClassName="flex w-full gap-2.5"
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
        "relative flex h-14 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-semibold text-white transition-all",
        isActive && "border-indigo-400/80 bg-white/[0.08] shadow-[0_0_0_3px_rgba(99,102,241,0.2),0_0_22px_rgba(99,102,241,0.32)]",
        invalid && "border-rose-400/70"
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-indigo-300 duration-1000" />
        </div>
      )}
    </div>
  );
}
