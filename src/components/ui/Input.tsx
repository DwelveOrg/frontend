import React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentPropsWithoutRef<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1a1a2e] outline-none transition placeholder:text-[#94a3b8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400/70 dark:focus:border-indigo-400 dark:focus:ring-[#4F46E5]/25",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
