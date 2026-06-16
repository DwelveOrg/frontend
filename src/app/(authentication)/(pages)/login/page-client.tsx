"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginPageClientProps } from "@/app/(authentication)/_types";
import { login, type LoginActionState } from "../../_lib/actions";
import AuthSplitLayout from "../../_components/AuthSplitLayout";

/* ── Left panel content ─────────────────────────────────────── */
function LoginPanel() {
  const bars = [55, 72, 85, 90, 78, 88, 95, 70, 82];
  const avatars = [
    { initials: "AY", color: "from-violet-500 to-purple-600" },
    { initials: "KM", color: "from-blue-500 to-indigo-600" },
    { initials: "SR", color: "from-emerald-500 to-teal-600" },
    { initials: "NB", color: "from-amber-400 to-orange-500" },
  ];

  return (
    <>
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-white.png" alt="Dwelve" className="h-8 w-auto" />

      {/* Main copy */}
      <div className="flex flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          Active across 500+ classrooms
        </div>

        <div>
          <h2 className="font-serif text-[2.5rem] leading-[1.12] tracking-tight text-white">
            Your students deserve<br />instant feedback.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Auto-graded tests. Real-time analytics.<br />Zero paperwork.
          </p>
        </div>

        {/* Floating test-result card */}
        <div className="w-72 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-white">Algebra · Chapter 5</p>
              <p className="mt-0.5 text-[10px] text-white/45">Graded automatically · 2 min ago</p>
            </div>
            <span className="shrink-0 rounded-lg border border-emerald-400/25 bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              ✓ Done
            </span>
          </div>
          {/* Mini bar chart */}
          <div className="mb-3 flex h-12 items-end gap-0.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px] bg-gradient-to-t from-indigo-400/50 to-indigo-200/80 transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/45">24 students</span>
            <span className="font-bold text-white">83% avg score</span>
          </div>
        </div>

        {/* Quick stat chip */}
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-xs text-white/70 backdrop-blur-sm">
          <span className="text-base">⚡</span>
          <span><strong className="text-white">5 tests</strong> graded in the last hour</span>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {avatars.map((a) => (
            <div
              key={a.initials}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.color} border-2 border-white/20 text-[10px] font-bold text-white shadow-lg`}
            >
              {a.initials}
            </div>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 bg-white/15 text-xs font-semibold text-white backdrop-blur-sm">
            +
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">2,400+ teachers</p>
          <p className="text-xs text-white/45">trust Dwelve every day</p>
        </div>
      </div>
    </>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function LoginPageClient({ logout }: Readonly<LoginPageClientProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const logoutToastShownRef = React.useRef(false);
  const [state, loginAction, isActionPending] = useActionState<LoginActionState, FormData>(
    login,
    { error: null, success: false }
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormField>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  React.useEffect(() => {
    if (state.error) {
      setError("root", { message: state.error });
      toast.error(state.error);
    } else if (state.success) {
      clearErrors("root");
      toast.success(t("auth.login.success"));
      router.push(state.redirectTo ?? "/dashboard");
    }
  }, [state, setError, clearErrors, router, t]);

  React.useEffect(() => {
    if (logout !== "1" || logoutToastShownRef.current) return;
    logoutToastShownRef.current = true;
    toast.success(t("auth.login.logoutSuccess"));
    router.replace("/login");
  }, [logout, router, t]);

  const onSubmit: SubmitHandler<LoginFormField> = async (data) => {
    clearErrors("root");
    const formData = new FormData();
    formData.set("identifier", data.identifier);
    formData.set("password", data.password);
    startTransition(() => { loginAction(formData); });
  };

  const isBusy = isSubmitting || isActionPending;

  return (
    <AuthSplitLayout
      imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
      imageAlt="Students collaborating with laptops"
      panelContent={<LoginPanel />}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile-only logo */}
        <div className="mb-8 lg:hidden">
          <img src="/images/logo-black.png" alt="Dwelve" className="h-7 w-auto dark:hidden" />
          <img src="/images/logo-white.png" alt="Dwelve" className="hidden h-7 w-auto dark:block" />
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {t("auth.login.access")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1a1a2e] dark:text-white">
              {t("auth.login.title")}
            </h1>
            <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.login.loginLabel")}
              </label>
              <Input
                {...register("identifier")}
                type="text"
                placeholder={t("auth.login.loginPlaceholder")}
                className={`w-full py-3 ${errors.identifier ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-[#1a1a2e] dark:text-white">
                  {t("auth.login.passwordLabel")}
                </label>
                <Link href="/password-reset" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  {t("auth.login.forgot")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.passwordPlaceholder")}
                  className={`w-full py-3 pr-11 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-1 right-1 inline-flex w-9 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-white transition"
                  aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                {errors.root.message}
              </div>
            )}

            <Btn
              type="submit"
              className="w-full flex items-center justify-center py-3 text-sm"
              disabled={isBusy}
            >
              {isBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : t("auth.login.submit")}
            </Btn>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748b] dark:text-slate-400">
            {t("auth.login.noAccount")}{" "}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              {t("auth.login.signup")}
            </Link>
          </p>

          <p className="mt-10 text-center">
            <Link href="/" className="text-xs text-[#94a3b8] hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400 transition">
              ← {t("auth.common.backToLanding")}
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
