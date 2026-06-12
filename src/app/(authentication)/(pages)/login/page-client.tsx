"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginPageClientProps } from "@/app/(authentication)/_types";
import { login, type LoginActionState } from "../../_lib/actions";
import BrutalField from "../../_components/BrutalField";

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
    startTransition(() => loginAction(formData));
  };

  const isBusy = isSubmitting || isActionPending;

  return (
    <div className="w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-7 shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-black lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <h1 className="mt-6 text-3xl font-black uppercase tracking-tight text-black">
        {t("auth.login.title")}
      </h1>
      <p className="mt-2 text-sm font-medium text-neutral-600">{t("auth.login.subtitle")}</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <BrutalField
          {...register("identifier")}
          type="text"
          label={t("auth.login.loginLabel")}
          placeholder={t("auth.login.loginPlaceholder")}
          error={errors.identifier?.message}
        />

        <div>
          <BrutalField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label={t("auth.login.passwordLabel")}
            placeholder={t("auth.login.passwordPlaceholder")}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black transition hover:text-[#4F46E5]"
                aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex justify-end">
            <Link href="/password-reset" className="text-xs font-extrabold uppercase tracking-wide text-[#4F46E5] hover:underline">
              {t("auth.login.forgot")}
            </Link>
          </div>
        </div>

        {errors.root && (
          <p className="rounded-lg border-2 border-black bg-red-100 px-3 py-2 text-xs font-bold text-red-700 shadow-[3px_3px_0_0_#000]">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-black bg-[#4F46E5] py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[5px_5px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : t("auth.login.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-medium text-neutral-600">
        {t("auth.login.noAccount")}{" "}
        <Link href="/signup" className="font-extrabold text-black underline underline-offset-2">
          {t("auth.login.signup")}
        </Link>
      </p>
    </div>
  );
}
