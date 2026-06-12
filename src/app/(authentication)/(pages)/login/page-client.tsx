"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { login, type LoginActionState } from "../../_lib/actions";
import UnderlineField from "../../_components/UnderlineField";

type LoginPageClientProps = {
  logout?: string;
};

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
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-[#1a1a2e] lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8] transition hover:text-[#1a1a2e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("auth.common.backToLanding")}
        </Link>
      </div>

      <div className="mt-12 h-px w-10 bg-[#1a1a2e]" />
      <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-[#1a1a2e]">
        {t("auth.login.title")}
      </h1>
      <p className="mt-3 text-[15px] text-[#64748b]">{t("auth.login.subtitle")}</p>

      <form className="mt-10 space-y-7" onSubmit={handleSubmit(onSubmit)} noValidate>
        <UnderlineField
          {...register("identifier")}
          type="text"
          label={t("auth.login.loginLabel")}
          placeholder={t("auth.login.loginPlaceholder")}
          error={errors.identifier?.message}
        />

        <div>
          <UnderlineField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label={t("auth.login.passwordLabel")}
            placeholder={t("auth.login.passwordPlaceholder")}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="inline-flex h-9 w-9 items-center justify-center text-[#94a3b8] transition hover:text-[#1a1a2e]"
                aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex justify-end">
            <Link href="/password-reset" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4F46E5] hover:underline">
              {t("auth.login.forgot")}
            </Link>
          </div>
        </div>

        {errors.root && <p className="text-xs text-rose-500">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isBusy}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a2e] py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {t("auth.login.submit")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-10 text-sm text-[#64748b]">
        {t("auth.login.noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-[#1a1a2e] underline underline-offset-4">
          {t("auth.login.signup")}
        </Link>
      </p>
    </div>
  );
}
