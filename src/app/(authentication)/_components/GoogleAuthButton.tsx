"use client";

import React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";

type Props = {
  onCredential: (idToken: string) => void;
  disabled?: boolean;
  text: string;
};

export default function GoogleAuthButton({ onCredential, disabled, text }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [gisLoading, setGisLoading] = React.useState(!!clientId);
  const buttonContainerRef = React.useRef<HTMLDivElement | null>(null);
  const initialized = React.useRef(false);
  const onCredentialRef = React.useRef(onCredential);

  React.useLayoutEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  const initGIS = React.useCallback(() => {
    if (
      initialized.current ||
      !window.google?.accounts?.id ||
      !clientId ||
      !buttonContainerRef.current
    ) {
      return;
    }

    initialized.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) {
          onCredentialRef.current(response.credential);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    buttonContainerRef.current.replaceChildren();
    window.google.accounts.id.renderButton(buttonContainerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 400,
    });

    setGisLoading(false);
  }, [clientId]);

  React.useEffect(() => {
    if (!clientId) return;

    if (window.google?.accounts?.id) {
      initGIS();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`
    );

    if (existing) {
      existing.addEventListener("load", initGIS);
      return () => existing.removeEventListener("load", initGIS);
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = initGIS;
    document.head.appendChild(script);
  }, [clientId, initGIS]);

  const isDisabled = disabled || gisLoading;

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-xl",
          "border border-[#e2e8f0] bg-white px-4 py-3",
          "text-sm font-medium text-[#1a1a2e] opacity-60",
          "dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        )}
      >
        <span>{text}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[44px] w-full items-center justify-center overflow-hidden rounded-xl",
        isDisabled && "pointer-events-none opacity-60"
      )}
      aria-label={text}
    >
      {gisLoading && (
        <div
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl",
            "border border-[#e2e8f0] bg-white px-4 py-3",
            "text-sm font-medium text-[#1a1a2e]",
            "dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          )}
        >
          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          <span>{text}</span>
        </div>
      )}
      <div ref={buttonContainerRef} className={cn("w-full", gisLoading && "hidden")} />
    </div>
  );
}
