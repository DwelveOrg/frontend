"use client";

import { useMutation } from "@tanstack/react-query";

import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import type {
  ForgotPasswordFormField,
  LoginFormField,
  RegularSignupFormField,
  ResetPasswordInput,
} from "@/app/(authentication)/_types/_schemas";
import {
  acceptTeacherInviteAction,
  forgotPasswordAction,
  googleAuthAction,
  loginAction,
  resetPasswordAction,
  signupAction,
  type AuthMutationResult,
  type ForgotPasswordResult,
} from "@/app/(authentication)/_lib/actions";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginFormField): Promise<AuthMutationResult> => {
      const result = await loginAction(input);
      return readSafeActionData(result, "Invalid email or password.");
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (input: RegularSignupFormField): Promise<AuthMutationResult> => {
      const result = await signupAction(input);
      return readSafeActionData(result, "Please check the form and try again.");
    },
  });
}

export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: async (idToken: string): Promise<AuthMutationResult> => {
      const result = await googleAuthAction({ idToken });
      return readSafeActionData(result, "Google sign-in failed. Please try again.");
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordFormField): Promise<ForgotPasswordResult> => {
      const result = await forgotPasswordAction(input);
      return readSafeActionData(result, "Unable to send the reset link. Please try again.");
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (input: ResetPasswordInput): Promise<AuthMutationResult> => {
      const result = await resetPasswordAction(input);
      return readSafeActionData(result, "This reset link is invalid or has expired.");
    },
  });
}

export function useAcceptTeacherInviteMutation() {
  return useMutation({
    mutationFn: async (token: string): Promise<AuthMutationResult> => {
      const result = await acceptTeacherInviteAction({ token });
      return readSafeActionData(result, "This invite link is invalid or has expired.");
    },
  });
}
