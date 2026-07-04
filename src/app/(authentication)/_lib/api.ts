import "server-only";

import {
  type BackendRequestInit,
  backendJson,
  BackendApiError,
  BackendResponseValidationError,
} from "@/lib/api/backend";
import type { z } from "zod";
import type {
  CreateSchoolFormField,
  JoinSchoolFormField,
  LoginFormField,
  RegularSignupFormField,
} from "@/app/(authentication)/_types/_schemas";
import {
  authResponseSchema,
  authTokensSchema,
  createSchoolResponseSchema,
  joinSchoolResponseSchema,
  schoolDetailResponseSchema,
  schoolMembersResponseSchema,
  teacherInviteResponseSchema,
  type AuthResponse,
  type AuthTokens,
  type BackendMember,
  type BackendSchool,
  type BackendUser,
  type CreateSchoolResponse,
  type JoinSchoolResponse,
  type SchoolDetailResponse,
  type SchoolMembersResponse,
  type TeacherInviteResponse,
} from "./api.schemas";

type BackendRequester = <TSchema extends z.ZodTypeAny>(
  path: string,
  init: BackendRequestInit<TSchema>,
) => Promise<z.infer<TSchema>>;

export { backendJson, BackendApiError, BackendResponseValidationError };
export type {
  AuthResponse,
  AuthTokens,
  BackendMember,
  BackendSchool,
  BackendUser,
  CreateSchoolResponse,
  JoinSchoolResponse,
  SchoolDetailResponse,
  SchoolMembersResponse,
  TeacherInviteResponse,
};

export type CreateSchoolRequestBody = Pick<
  CreateSchoolFormField,
  "name" | "description" | "country" | "city" | "logoUrl"
>;

export function loginRequest(input: LoginFormField) {
  return backendJson("/auth/login", {
    method: "POST",
    body: input,
    responseSchema: authResponseSchema,
  });
}

export function signupRequest(input: RegularSignupFormField) {
  return backendJson("/auth/signup", {
    method: "POST",
    body: input,
    responseSchema: authResponseSchema,
  });
}

export function googleAuthRequest(idToken: string) {
  return backendJson("/auth/google", {
    method: "POST",
    body: { idToken },
    responseSchema: authResponseSchema,
  });
}

export function refreshTokensRequest(refreshToken: string) {
  return backendJson("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    responseSchema: authTokensSchema,
  });
}

export function logoutRequest(refreshToken: string) {
  return backendJson("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export function createSchoolRequest(
  body: CreateSchoolRequestBody,
  requestJson: BackendRequester = backendJson,
) {
  return requestJson("/schools", {
    method: "POST",
    body,
    responseSchema: createSchoolResponseSchema,
  });
}

export function joinSchoolRequest(
  input: JoinSchoolFormField,
  requestJson: BackendRequester = backendJson,
) {
  return requestJson("/schools/join", {
    method: "POST",
    body: { code: input.code.trim() },
    responseSchema: joinSchoolResponseSchema,
  });
}

export function getSchoolRequest(schoolId: string, requestJson: BackendRequester = backendJson) {
  return requestJson(`/schools/${schoolId}`, {
    responseSchema: schoolDetailResponseSchema,
  });
}

export type UpdateSchoolRequestBody = Partial<
  Pick<CreateSchoolRequestBody, "name"> & {
    description: string | null;
    country: string | null;
    city: string | null;
    logoUrl: string | null;
  }
>;

export function updateSchoolRequest(
  schoolId: string,
  body: UpdateSchoolRequestBody,
  requestJson: BackendRequester = backendJson,
) {
  return requestJson(`/schools/${schoolId}`, {
    method: "PATCH",
    body,
    responseSchema: schoolDetailResponseSchema,
  });
}

export function getSchoolMembersRequest(
  schoolId: string,
  requestJson: BackendRequester = backendJson,
) {
  return requestJson(`/schools/${schoolId}/members`, {
    responseSchema: schoolMembersResponseSchema,
  });
}

export function createTeacherInviteRequest(
  schoolId: string,
  body: { email: string },
  requestJson: BackendRequester = backendJson,
) {
  return requestJson(`/schools/${schoolId}/invites/teacher`, {
    method: "POST",
    body,
    responseSchema: teacherInviteResponseSchema,
  });
}
