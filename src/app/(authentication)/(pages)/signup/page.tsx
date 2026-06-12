"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Presentation, Sparkles } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import NeonField from "../../_components/NeonField";
import NeonOtp from "../../_components/NeonOtp";

const roleOptions = [
  { value: "student", icon: GraduationCap, labelKey: "auth.signup.student" },
  { value: "teacher", icon: Presentation, labelKey: "auth.signup.teacher" },
] as const;

const DEMO_VERIFICATION_CODE = "123456";

function SectionRule({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 text-[11px] font-bold text-indigo-300">
        {n}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export default function SignupPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormField>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      verificationCode: "",
      username: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const role = watch("role");

  const onSubmit: SubmitHandler<SignupFormField> = async (data) => {
    if (data.verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
      setError("verificationCode", { message: t("auth.signup.verificationIncorrect") });
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 700));
    setError("root", { message: t("auth.signup.backendMissing") });
  };

  return (
    <div className="my-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
          <span className="font-serif text-2xl leading-none text-white">Dwelve</span>
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">{t("auth.signup.title")}</h1>
      <p className="mt-2 text-sm text-slate-400">{t("auth.signup.subtitle")}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <SectionRule n="01" />
        <div className="grid grid-cols-2 gap-3">
          {roleOptions.map(({ value, icon: Icon, labelKey }) => {
            const active = role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue("role", value, { shouldValidate: true })}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold transition-all ${
                  active
                    ? "border-indigo-400/70 bg-indigo-500/15 text-white shadow-[0_0_24px_rgba(99,102,241,0.25)]"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="h-6 w-6" />
                {t(labelKey)}
              </button>
            );
          })}
        </div>
        <NeonField {...register("fullName")} type="text" label={t("auth.signup.fullName")} placeholder={t("auth.signup.fullNamePlaceholder")} error={errors.fullName?.message} />
        <NeonField {...register("email")} type="email" label={t("auth.signup.email")} placeholder={t("auth.signup.emailPlaceholder")} error={errors.email?.message} />

        <SectionRule n="02" />
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {t("auth.signup.verificationLabel")}
          </label>
          <p className="mb-3 text-xs text-slate-500">
            {t("auth.signup.demoCode")}: <span className="font-semibold text-indigo-300">{DEMO_VERIFICATION_CODE}</span>
          </p>
          <Controller
            control={control}
            name="verificationCode"
            render={({ field }) => (
              <NeonOtp
                value={field.value ?? ""}
                invalid={!!errors.verificationCode}
                onChange={(value) => {
                  field.onChange(value);
                  if (errors.verificationCode) clearErrors("verificationCode");
                }}
              />
            )}
          />
          {errors.verificationCode && <p className="mt-2 text-xs text-rose-300">{errors.verificationCode.message}</p>}
        </div>

        <SectionRule n="03" />
        <NeonField {...register("username")} type="text" label={t("auth.signup.username")} placeholder={t("auth.signup.usernamePlaceholder")} error={errors.username?.message} />
        <NeonField
          {...register("password")}
          type={showPassword ? "text" : "password"}
          label={t("auth.signup.password")}
          placeholder={t("auth.signup.createPasswordPlaceholder")}
          error={errors.password?.message}
          trailing={
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <NeonField
          {...register("confirmPassword")}
          type={showConfirmPassword ? "text" : "password"}
          label={t("auth.signup.confirmPassword")}
          placeholder={t("auth.signup.confirmPasswordPlaceholder")}
          error={errors.confirmPassword?.message}
          trailing={
            <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}>
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-sm text-slate-300 transition hover:bg-white/[0.06]">
          <input {...register("termsAccepted")} type="checkbox" className="mt-0.5 h-4 w-4 accent-indigo-400" />
          <span>{t("auth.signup.terms")}</span>
        </label>
        {errors.termsAccepted && <p className="-mt-2 text-xs text-rose-300">{errors.termsAccepted.message}</p>}
        {errors.root && (
          <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_44px_rgba(99,102,241,0.6)] disabled:opacity-70"
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? t("auth.signup.creating") : t("auth.signup.createAccount", { role })}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-400">
        {t("auth.signup.alreadyAccount")}{" "}
        <Link href="/login" className="font-semibold text-white hover:text-indigo-200">
          {t("auth.signup.login")}
        </Link>
      </p>
    </div>
  );
}
