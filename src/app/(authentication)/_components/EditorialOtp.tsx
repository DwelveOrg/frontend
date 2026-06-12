"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type EditorialOtpProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Editorial 6-digit OTP — underline cells, ink digits. */
export default function EditorialOtp({ value, onChange, invalid, autoFocus }: EditorialOtpProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={6}
      autoFocus={autoFocus}
      containerClassName="flex gap-2.5"
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
        "relative flex h-14 flex-1 items-center justify-center border-b-2 border-slate-200 text-xl font-semibold text-[#1a1a2e] transition-all",
        isActive && "border-[#4F46E5]",
        invalid && "border-rose-400"
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px animate-caret-blink bg-[#4F46E5] duration-1000" />
        </div>
      )}
    </div>
  );
}
