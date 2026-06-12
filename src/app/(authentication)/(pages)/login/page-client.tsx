"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginPageClientProps } from "@/app/(authentication)/_types";
import { login, type LoginActionState } from "../../_lib/actions";

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
    defaultValues: {
      identifier: "",
      password: "",
    },
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
    startTransition(() => {
      loginAction(formData);
    });
  };

  return (
    <section className="w-full px-4">
      <div className="mx-auto relative w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#111827]/80">
        <div className="mb-6">
          <div className="flex justify-end">
            <Link
              href="/"
              aria-label={t("auth.common.backToLanding")}
              className="inline-flex absolute top-4 right-4 h-9 w-9 items-center justify-center rounded-lg border border-[#c7d8ff] bg-white text-[#0F2854] transition hover:bg-[#eef4ff] hover:text-[#0046FF] dark:border-white/15 dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="inline-flex items-center gap-0.5">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0046FF] dark:text-[#8fb0ff]">
            {t("auth.login.access")}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0F2854] dark:text-white">
            {t("auth.login.title")}
          </h2>
          <p className="mt-2 text-sm text-[#355181] dark:text-slate-300">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">
              {t("auth.login.loginLabel")}
            </label>
            <Input
              {...register("identifier")}
              type="text"
              placeholder={t("auth.login.loginPlaceholder")}
              className={`w-full ${errors.identifier ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
            />
            {errors.identifier && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">
                {t("auth.login.passwordLabel")}
              </label>
              <Link
                href="/password-reset"
                className="block text-sm text-[#0046FF] hover:underline dark:text-[#8fb0ff]"
              >
                {t("auth.login.forgot")}
              </Link>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.login.passwordPlaceholder")}
                className={`w-full pr-11 ${errors.password ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#355181] transition hover:bg-slate-100 hover:text-[#0046FF] focus-visible:outline-none dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
            {errors.root && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.root.message}
              </p>
            )}
          </div>

          <Btn
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={isSubmitting || isActionPending}
          >
            {isSubmitting || isActionPending ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              t("auth.login.submit")
            )}
          </Btn>
        </form>

        <p className="mt-5 text-center text-sm text-[#355181] dark:text-slate-300">
          {t("auth.login.noAccount")}{" "}
          <Link href="/signup" className="font-semibold text-[#0046FF]">
            {t("auth.login.signup")}
          </Link>
        </p>
      </div>
    </section>
  );
}
