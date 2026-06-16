"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  RegularSignupFormField,
  regularSignupSchema,
} from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { regularSignupDefaults } from "../../_constants";
import { googleSignup, signup, type SignupActionState } from "../../_lib/actions";
import AuthSplitLayout from "../../_components/AuthSplitLayout";

/* ── Google SVG ─────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.96 11.96 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

/* ── Left panel content ─────────────────────────────────────── */
function SignupPanel() {
  const features = [
    { icon: "⚡", label: "Instant auto-grading" },
    { icon: "📊", label: "Progress analytics" },
    { icon: "📄", label: "PDF test generation" },
    { icon: "📱", label: "Works on any device" },
  ];

  return (
    <>
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-white.png" alt="Dwelve" className="h-8 w-auto" />

      {/* Main copy */}
      <div className="flex flex-col gap-7">
        <div>
          <h2 className="font-serif text-[2.5rem] leading-[1.12] tracking-tight text-white">
            Start learning<br />smarter today.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            The platform built for students and teachers who want real results, not more paperwork.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 backdrop-blur-sm"
            >
              <span className="text-base">{f.icon}</span>
              <span className="text-xs font-medium text-white/80">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Score card */}
        <div className="w-64 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/45">Physics · Unit 4</p>
              <p className="text-xs font-semibold text-white">Your latest score</p>
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="87.96 100"
                  pathLength="100"
                />
              </svg>
              <span className="relative text-[11px] font-bold text-white">94%</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {["A", "B", "A+", "B+", "A"].map((g, i) => (
              <div key={i} className="flex-1 rounded-lg bg-white/12 py-1.5 text-center text-[10px] font-semibold text-white/80">
                {g}
              </div>
            ))}
          </div>
          <p className="mt-2 text-right text-[10px] text-white/40">Last 5 subjects</p>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {[
            { initials: "JK", color: "from-pink-500 to-rose-600" },
            { initials: "LM", color: "from-indigo-400 to-blue-600" },
            { initials: "TA", color: "from-teal-500 to-emerald-600" },
          ].map((a) => (
            <div key={a.initials} className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.color} border-2 border-white/20 text-[10px] font-bold text-white`}>
              {a.initials}
            </div>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 bg-white/15 text-xs font-semibold text-white">+</div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">12,000+ students</p>
          <p className="text-xs text-white/45">already on Dwelve</p>
        </div>
      </div>
    </>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, signupAction, isActionPending] = useActionState<SignupActionState, FormData>(
    signup, { error: null, success: false }
  );
  const [isGooglePending, startGoogleTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegularSignupFormField>({
    resolver: zodResolver(regularSignupSchema),
    defaultValues: regularSignupDefaults,
  });

  React.useEffect(() => {
    if (state.error) {
      setError("root", { message: state.error });
      toast.error(state.error);
    } else if (state.success) {
      clearErrors("root");
      toast.success(t("auth.signup.success"));
      router.push(state.redirectTo ?? "/dashboard");
    }
  }, [state, setError, clearErrors, router, t]);

  const onSubmit: SubmitHandler<RegularSignupFormField> = async (data) => {
    clearErrors("root");
    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("email", data.email);
    formData.set("password", data.password);
    startTransition(() => { signupAction(formData); });
  };

  const onGoogle = () => {
    startGoogleTransition(async () => {
      const res = await googleSignup();
      if (res.success) {
        toast.success(t("auth.signup.success"));
        router.push(res.redirectTo ?? "/dashboard");
      } else if (res.error) {
        toast.error(res.error);
      }
    });
  };

  const isBusy = isSubmitting || isActionPending || isGooglePending;

  return (
    <AuthSplitLayout
      imageSrc="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80"
      imageAlt="Student studying at a desk"
      panelContent={<SignupPanel />}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <img src="/images/logo-black.png" alt="Dwelve" className="h-7 w-auto dark:hidden" />
          <img src="/images/logo-white.png" alt="Dwelve" className="hidden h-7 w-auto dark:block" />
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {t("auth.signup.access")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1a1a2e] dark:text-white">
              {t("auth.signup.title")}
            </h1>
            <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
              {t("auth.signup.subtitle")}
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={onGoogle}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#1a1a2e] shadow-sm transition hover:bg-[#f8fafc] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            {isGooglePending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                {t("auth.signup.google")}
              </>
            )}
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-black/8 dark:bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#94a3b8]">
              {t("auth.signup.or")}
            </span>
            <span className="h-px flex-1 bg-black/8 dark:bg-white/10" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.signup.fullName")}
              </label>
              <Input
                {...register("fullName")}
                type="text"
                placeholder={t("auth.signup.fullNamePlaceholder")}
                className={`w-full py-3 ${errors.fullName ? "border-red-500" : ""}`}
              />
              {errors.fullName && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.signup.email")}
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder={t("auth.signup.emailPlaceholder")}
                className={`w-full py-3 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.signup.password")}
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.signup.createPasswordPlaceholder")}
                  className={`w-full py-3 pr-11 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-1 right-1 inline-flex w-9 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-white transition"
                  aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                {errors.root.message}
              </div>
            )}

            <Btn type="submit" disabled={isBusy} className="w-full flex items-center justify-center py-3 text-sm">
              {isSubmitting || isActionPending
                ? <LoaderCircle className="h-5 w-5 animate-spin" />
                : t("auth.signup.createAccount")
              }
            </Btn>

            <p className="text-center text-xs text-[#94a3b8] dark:text-slate-500">
              {t("auth.signup.terms")}
            </p>
          </form>

          {/* Admin callout */}
          <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30">
            <div>
              <p className="text-xs font-semibold text-[#1a1a2e] dark:text-white">{t("auth.signup.adminPrompt")}</p>
              <Link
                href="/signup/admin"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t("auth.signup.adminCta")}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <span className="text-2xl" aria-hidden="true">🏫</span>
          </div>

          <p className="mt-6 text-center text-sm text-[#64748b] dark:text-slate-400">
            {t("auth.signup.alreadyAccount")}{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              {t("auth.signup.login")}
            </Link>
          </p>

          <p className="mt-6 text-center">
            <Link href="/" className="text-xs text-[#94a3b8] hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400 transition">
              ← {t("auth.common.backToLanding")}
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
