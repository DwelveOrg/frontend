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
import { regularSignupDefaults } from "../../_constants/signup";
import { googleSignup, signup, type SignupActionState } from "../../_lib/actions";
import AuthSplitLayout from "../../_components/AuthSplitLayout";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import GoogleIcon from "../../_components/GoogleIcon";
import SignupPanel from "./_sections/SignupPanel";

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
    <AuthSplitLayout variant="signup" panelContent={<SignupPanel />}>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <DwelveLogo variant="form" />
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
