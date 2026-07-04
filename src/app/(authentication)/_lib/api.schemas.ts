import { z } from "zod";

export const schoolRoleSchema = z.enum(["OWNER", "DIRECTOR", "ADMIN", "TEACHER", "STUDENT"]);

export const backendUserSchema = z
  .object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
  })
  .passthrough();

export const backendSchoolSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    studentJoinCode: z.string().nullable().optional(),
  })
  .passthrough();

export const backendMemberSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    schoolId: z.string(),
    role: schoolRoleSchema,
  })
  .passthrough();

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const memberWithSchoolSchema = backendMemberSchema.extend({
  school: z
    .object({
      id: z.string(),
    })
    .passthrough()
    .optional(),
});

export const authResponseSchema = z
  .object({
    user: backendUserSchema,
    school: backendSchoolSchema.optional(),
    member: backendMemberSchema.optional(),
    memberships: z.array(memberWithSchoolSchema).optional(),
    tokens: authTokensSchema,
  })
  .passthrough();

export const createSchoolResponseSchema = z
  .object({
    school: backendSchoolSchema,
    membership: backendMemberSchema.optional(),
    member: backendMemberSchema.optional(),
    tokens: authTokensSchema,
  })
  .passthrough();

export const schoolDetailResponseSchema = z
  .object({
    school: backendSchoolSchema,
    currentUserRole: schoolRoleSchema,
    membership: backendMemberSchema,
  })
  .passthrough();

export const joinSchoolResponseSchema = z
  .object({
    school: backendSchoolSchema,
    membership: backendMemberSchema,
    tokens: authTokensSchema,
  })
  .passthrough();

export type BackendUser = z.infer<typeof backendUserSchema>;
export type BackendSchool = z.infer<typeof backendSchoolSchema>;
export type BackendMember = z.infer<typeof backendMemberSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type CreateSchoolResponse = z.infer<typeof createSchoolResponseSchema>;
export type SchoolDetailResponse = z.infer<typeof schoolDetailResponseSchema>;
export type JoinSchoolResponse = z.infer<typeof joinSchoolResponseSchema>;
