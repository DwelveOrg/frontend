"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type BrutalOtpProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
};

/** Neo-brutalist 6-digit OTP — bordered cells, hard shadows, yellow active. */
export default function BrutalOtp({ value, onChange, invalid, autoFocus }: BrutalOtpProps) {
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
        "relative flex h-14 flex-1 items-center justify-center rounded-lg border-2 border-black bg-white text-xl font-extrabold text-black shadow-[3px_3px_0_0_#000] transition-all",
        isActive && "-translate-y-0.5 bg-[#FCD34D] shadow-[5px_5px_0_0_#4F46E5]",
        invalid && "shadow-[3px_3px_0_0_#ef4444]"
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 animate-caret-blink bg-black duration-1000" />
        </div>
      )}
    </div>
  );
}
