"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GraduationCap, LoaderCircle } from "lucide-react";

import Btn from "@/components/Custom/CustomButton";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import { useAcceptTeacherInviteMutation } from "@/app/(authentication)/_hooks/useAuthMutations";

type InviteAcceptClientProps = {
  token: string;
  isAuthenticated: boolean;
  email?: string;
};

export default function InviteAcceptClient({
  token,
  isAuthenticated,
  email,
}: Readonly<InviteAcceptClientProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const acceptMutation = useAcceptTeacherInviteMutation();
  const [error, setError] = React.useState<string | null>(null);

  const nextPath = `/invite/teacher/${encodeURIComponent(token)}`;
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;
  const signupHref = `/signup?next=${encodeURIComponent(nextPath)}`;

  const onAccept = async () => {
    setError(null);

    try {
      const result = await acceptMutation.mutateAsync(token);
      toast.success(t("auth.invite.success"));
      router.push(result.redirectTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.invite.error");
      setError(message);
      toast.error(message);
    }
  };

  const isBusy = acceptMutation.isPending;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f6f7fb] px-6 py-12 dark:bg-[#0b0f1a]">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[90px] dark:bg-indigo-600/20" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-700/15" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 flex justify-center">
          <DwelveLogo variant="form" />
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#111827]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h1 className="text-center text-2xl font-bold text-[#1a1a2e] dark:text-white">
            {t("auth.invite.teacherTitle")}
          </h1>
          <p className="mt-2 text-center text-sm text-[#64748b] dark:text-slate-400">
            {isAuthenticated
              ? t("auth.invite.teacherSubtitle")
              : t("auth.invite.authPromptSubtitle")}
          </p>

          {isAuthenticated ? (
            <div className="mt-7 space-y-4">
              {email && (
                <p className="text-center text-xs text-[#94a3b8] dark:text-slate-500">
                  {t("auth.invite.signedInAs", { email })}
                </p>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <Btn
                type="button"
                onClick={onAccept}
                disabled={isBusy}
                className="w-full flex items-center justify-center py-3 text-sm"
              >
                {isBusy ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  t("auth.invite.accept")
                )}
              </Btn>

              <p className="text-center text-xs text-[#94a3b8] dark:text-slate-500">
                {t("auth.invite.emailMismatchNote")}
              </p>
            </div>
          ) : (
            <div className="mt-7 space-y-3">
              <Link href={loginHref} className="block">
                <Btn type="button" className="w-full flex items-center justify-center py-3 text-sm">
                  {t("auth.invite.login")}
                </Btn>
              </Link>
              <Link
                href={signupHref}
                className="flex w-full items-center justify-center rounded-xl border border-[#e2e8f0] py-3 text-sm font-semibold text-[#1a1a2e] transition hover:bg-[#f8fafc] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                {t("auth.invite.signup")}
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-[#94a3b8] transition hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400"
          >
            &larr; {t("auth.invite.backToLanding")}
          </Link>
        </p>
      </div>
    </div>
  );
}
