"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BrutalFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

/** Neo-brutalist field — thick black border, hard offset shadow that snaps to indigo on focus. */
const BrutalField = React.forwardRef<HTMLInputElement, BrutalFieldProps>(
  ({ label, error, trailing, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-black">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              "w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black shadow-[4px_4px_0_0_#000] outline-none transition-all placeholder:text-neutral-400 focus:-translate-y-0.5 focus:shadow-[6px_6px_0_0_#4F46E5]",
              trailing && "pr-12",
              error && "shadow-[4px_4px_0_0_#ef4444] focus:shadow-[6px_6px_0_0_#ef4444]",
              className
            )}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>}
      </div>
    );
  }
);

BrutalField.displayName = "BrutalField";

export default BrutalField;
