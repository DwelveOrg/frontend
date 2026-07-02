import "server-only";

import type { SchoolRole } from "../_types/auth";

const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

type BackendErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type BackendUser = {
  id: string;
  fullName: string;
  email: string;
};

export type BackendSchool = {
  id: string;
  name: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
  studentJoinCode?: string | null;
};

export type BackendMember = {
  id: string;
  userId: string;
  schoolId: string;
  role: SchoolRole;
};

export type AuthResponse = {
  user: BackendUser;
  school?: BackendSchool;
  member?: BackendMember;
  memberships?: Array<BackendMember & { school?: { id: string } }>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type CreateSchoolResponse = {
  school: BackendSchool;
  membership?: BackendMember;
  member?: BackendMember;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type SchoolDetailResponse = {
  school: BackendSchool;
  currentUserRole: SchoolRole;
  membership: BackendMember;
};

export type JoinSchoolResponse = {
  school: BackendSchool;
  membership: BackendMember;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export class BackendApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendApiError";
  }
}

function getApiBaseUrl() {
  return (process.env.DWELVE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function getErrorMessage(body: BackendErrorBody | null) {
  if (Array.isArray(body?.message)) {
    return body.message.join(" ");
  }

  return body?.message ?? body?.error ?? "Something went wrong. Please try again.";
}

async function readJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function backendJson<TResponse>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<TResponse> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const body = await readJson<TResponse | BackendErrorBody>(response);

  if (!response.ok) {
    throw new BackendApiError(getErrorMessage(body as BackendErrorBody | null));
  }

  return body as TResponse;
}
