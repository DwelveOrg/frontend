"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  AdminSignupFormField,
  adminSignupSchema,
} from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  adminSignupDefaults,
  adminSignupStepCount,
  adminSignupStepFields,
  centerSizeOptions,
  centerTypeOptions,
} from "../../../_constants";
import { adminSignup, type SignupActionState } from "../../../_lib/actions";
import AuthSplitLayout from "../../../_components/AuthSplitLayout";

/* ── Left panel ─────────────────────────────────────────────── */
function AdminPanel() {
  const stats = [
    { value: "3 min", label: "avg setup" },
    { value: "500+", label: "centers" },
    { value: "0", label: "paper waste" },
  ];

  const features = [
    { icon: "🏫", title: "Class management", desc: "Manage teachers, students, and classes from one place." },
    { icon: "📄", title: "PDF test import", desc: "Upload a PDF and Dwelve builds the test draft instantly." },
    { icon: "📊", title: "Center analytics", desc: "Track scores, trends, and progress across all your classes." },
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
            One platform for<br />your whole center.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            From test creation to grading and analytics — everything your school or learning center needs, in one place.
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex gap-2">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Class overview card */}
        <div className="w-[280px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Class 10A — Mathematics</p>
              <p className="mt-0.5 text-[10px] text-white/45">3 active tests · 28 students</p>
            </div>
            <span className="rounded-lg bg-indigo-400/20 px-2 py-1 text-[10px] font-semibold text-indigo-300">Live</span>
          </div>
          <div className="space-y-2">
            {[
              { name: "Algebra Quiz", pct: 88 },
              { name: "Geometry Final", pct: 72 },
              { name: "Statistics HW", pct: 95 },
            ].map((t) => (
              <div key={t.name}>
                <div className="mb-1 flex justify-between text-[10px] text-white/55">
                  <span>{t.name}</span>
                  <span className="font-semibold text-white/80">{t.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-200"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 text-base">{f.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{f.title}</p>
                <p className="text-[11px] text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <p className="text-sm text-white/50">
        Trusted by <span className="font-semibold text-white">500+ learning centers</span> worldwide
      </p>
    </>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function AdminSignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, adminSignupAction, isActionPending] = useActionState<SignupActionState, FormData>(
    adminSignup, { error: null, success: false }
  );

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupFormField>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: adminSignupDefaults,
  });

  const values = useWatch({ control });
  const progress = ((step + 1) / adminSignupStepCount) * 100;
  const stepTitles = [
    t("auth.adminSignup.stepAccount"),
    t("auth.adminSignup.stepCenter"),
    t("auth.adminSignup.stepReview"),
  ];

  React.useEffect(() => {
    if (state.error) {
      setError("root", { message: state.error });
      toast.error(state.error);
    } else if (state.success) {
      clearErrors("root");
      toast.success(t("auth.adminSignup.success"));
      router.push(state.redirectTo ?? "/dashboard");
    }
  }, [state, setError, clearErrors, router, t]);

  const nextStep = async () => {
    const valid = await trigger(adminSignupStepFields[step], { shouldFocus: true });
    if (!valid) return;
    setStep((p) => Math.min(p + 1, adminSignupStepCount - 1));
  };

  const prevStep = () => setStep((p) => Math.max(p - 1, 0));

  const onSubmit: SubmitHandler<AdminSignupFormField> = async (data) => {
    clearErrors("root");
    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("confirmPassword", data.confirmPassword);
    formData.set("centerName", data.centerName);
    formData.set("centerType", data.centerType);
    formData.set("centerSize", data.centerSize);
    formData.set("termsAccepted", data.termsAccepted ? "true" : "");
    startTransition(() => { adminSignupAction(formData); });
  };

  const isBusy = isSubmitting || isActionPending;
  const centerTypeLabel = centerTypeOptions.find((o) => o.value === values.centerType)?.labelKey;
  const centerSizeLabel = centerSizeOptions.find((o) => o.value === values.centerSize)?.labelKey;

  return (
    <AuthSplitLayout
      imageSrc="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1400&q=80"
      imageAlt="Lecture hall from above"
      panelContent={<AdminPanel />}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <img src="/images/logo-black.png" alt="Dwelve" className="h-7 w-auto dark:hidden" />
          <img src="/images/logo-white.png" alt="Dwelve" className="hidden h-7 w-auto dark:block" />
        </div>

        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              {t("auth.adminSignup.access")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1a1a2e] dark:text-white">
              {t("auth.adminSignup.title")}
            </h1>
            <p className="mt-2 text-sm text-[#64748b] dark:text-slate-400">
              {t("auth.adminSignup.subtitle")}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2.5 flex items-center justify-between text-xs">
              <span className="font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.adminSignup.step", { current: step + 1, total: adminSignupStepCount })}
                <span className="ml-1.5 text-[#64748b] dark:text-slate-400">· {stepTitles[step]}</span>
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/6 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step dots */}
            <div className="mt-3 flex gap-2">
              {Array.from({ length: adminSignupStepCount }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-indigo-600" : "bg-black/8 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* ── Step 0: account ── */}
            {step === 0 && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.fullName")}
                  </label>
                  <Input
                    {...register("fullName")}
                    type="text"
                    placeholder={t("auth.adminSignup.fullNamePlaceholder")}
                    className={`w-full py-3 ${errors.fullName ? "border-red-500" : ""}`}
                  />
                  {errors.fullName && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.email")}
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder={t("auth.adminSignup.emailPlaceholder")}
                    className={`w-full py-3 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.password")}
                  </label>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.adminSignup.createPasswordPlaceholder")}
                      className={`w-full py-3 pr-11 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button type="button" onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-1 right-1 inline-flex w-9 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-white transition"
                      aria-label={showPassword ? t("auth.adminSignup.hidePassword") : t("auth.adminSignup.showPassword")}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("auth.adminSignup.confirmPasswordPlaceholder")}
                      className={`w-full py-3 pr-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute inset-y-1 right-1 inline-flex w-9 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#1a1a2e] dark:hover:text-white transition"
                      aria-label={showConfirmPassword ? t("auth.adminSignup.hideConfirmPassword") : t("auth.adminSignup.showConfirmPassword")}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
                </div>
              </>
            )}

            {/* ── Step 1: center ── */}
            {step === 1 && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.centerName")}
                  </label>
                  <Input
                    {...register("centerName")}
                    type="text"
                    placeholder={t("auth.adminSignup.centerNamePlaceholder")}
                    className={`w-full py-3 ${errors.centerName ? "border-red-500" : ""}`}
                  />
                  {errors.centerName && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.centerName.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.centerType")}
                  </label>
                  <Controller
                    control={control}
                    name="centerType"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        {centerTypeOptions.map((option) => {
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition cursor-pointer ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                                  : "border-black/10 text-[#64748b] hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                              }`}
                            >
                              {t(option.labelKey)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.centerType && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.centerType.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                    {t("auth.adminSignup.centerSize")}
                  </label>
                  <Controller
                    control={control}
                    name="centerSize"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        {centerSizeOptions.map((option) => {
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition cursor-pointer ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                                  : "border-black/10 text-[#64748b] hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                              }`}
                            >
                              {t(option.labelKey)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.centerSize && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.centerSize.message}</p>}
                </div>
              </>
            )}

            {/* ── Step 2: review ── */}
            {step === 2 && (
              <>
                <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-5 dark:border-white/8 dark:bg-white/3">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">
                    {t("auth.adminSignup.reviewTitle")}
                  </p>
                  <dl className="space-y-3">
                    {[
                      { label: t("auth.adminSignup.fullName"), value: values.fullName },
                      { label: t("auth.adminSignup.email"), value: values.email },
                      { label: t("auth.adminSignup.centerName"), value: values.centerName },
                      {
                        label: t("auth.adminSignup.centerType"),
                        value: centerTypeLabel ? t(centerTypeLabel) : "",
                      },
                      {
                        label: t("auth.adminSignup.centerSize"),
                        value: centerSizeLabel ? t(centerSizeLabel) : "",
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-baseline justify-between gap-4 text-sm">
                        <dt className="shrink-0 text-[#94a3b8] dark:text-slate-500">{label}</dt>
                        <dd className="text-right font-semibold text-[#1a1a2e] dark:text-white truncate">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/8 bg-[#fafafa] p-3.5 text-sm dark:border-white/8 dark:bg-white/3">
                  <input
                    {...register("termsAccepted")}
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-xs leading-relaxed text-[#64748b] dark:text-slate-400">
                    {t("auth.adminSignup.terms")}
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="-mt-2 text-xs text-red-600 dark:text-red-400">{errors.termsAccepted.message}</p>
                )}

                {errors.root && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                    {errors.root.message}
                  </div>
                )}
              </>
            )}

            {/* Navigation */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Btn
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="mt-0 w-full border border-black/10 bg-white py-3 text-sm text-[#1a1a2e] hover:bg-[#f8fafc] disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto sm:min-w-28"
              >
                {t("auth.adminSignup.back")}
              </Btn>

              {step < adminSignupStepCount - 1 ? (
                <Btn type="button" onClick={nextStep} className="w-full py-3 text-sm sm:w-auto sm:min-w-36">
                  {t("auth.adminSignup.continue")}
                </Btn>
              ) : (
                <Btn
                  type="submit"
                  disabled={isBusy}
                  className="flex w-full items-center justify-center py-3 text-sm sm:w-auto sm:min-w-40"
                >
                  {isBusy
                    ? <LoaderCircle className="h-5 w-5 animate-spin" />
                    : t("auth.adminSignup.createCenter")
                  }
                </Btn>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748b] dark:text-slate-400">
            {t("auth.adminSignup.personalPrompt")}{" "}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              {t("auth.adminSignup.personalCta")}
            </Link>
          </p>

          <p className="mt-4 text-center">
            <Link href="/" className="text-xs text-[#94a3b8] hover:text-[#64748b] dark:text-slate-500 dark:hover:text-slate-400 transition">
              ← {t("auth.common.backToLanding")}
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
