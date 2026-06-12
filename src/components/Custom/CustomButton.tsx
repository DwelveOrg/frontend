import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Btn = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex h-11 items-center justify-center rounded-xl bg-[#4F46E5] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:bg-[#4338ca] hover:shadow-[0_14px_30px_rgba(79,70,229,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4F46E5]/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Btn.displayName = "Btn";

export default Btn;