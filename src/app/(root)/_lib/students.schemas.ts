import { z } from "zod";

import { schoolRoleSchema } from "@/app/(authentication)/_lib/api.schemas";

/**
 * Zod schemas for `GET /students`. Shapes mirror the fields documented in
 * `docs/features/students-page-contract.md`. `.passthrough()` keeps
 * forward-compatible fields from failing validation.
 */

/** A class assignment attached to a student, as returned inside `classes[]`. */
export const studentClassAssignmentSchema = z
  .object({
    assignmentId: z.string(),
    classId: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  })
  .passthrough();

export const studentItemSchema = z
  .object({
    id: z.string(),
    studentId: z.string().optional(),
    memberId: z.string(),
    userId: z.string(),
    fullName: z.string(),
    email: z.string(),
    role: schoolRoleSchema,
    studentCode: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    classes: z.array(studentClassAssignmentSchema).default([]),
    classCount: z.number().optional(),
    joinedAt: z.union([z.string(), z.date()]).nullable().optional(),
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
  })
  .passthrough();

/** `GET /students` - ADMIN only. Backend scopes by current school session. */
export const studentsResponseSchema = z
  .object({
    students: z.array(studentItemSchema),
    count: z.number().optional(),
  })
  .passthrough();

export type StudentClassAssignment = z.infer<typeof studentClassAssignmentSchema>;
export type StudentItem = z.infer<typeof studentItemSchema>;
export type StudentsResponse = z.infer<typeof studentsResponseSchema>;
