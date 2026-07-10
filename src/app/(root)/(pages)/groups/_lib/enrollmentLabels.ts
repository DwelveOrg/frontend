import type {
  EnrollmentMode,
  EnrollmentStatus,
} from "@/app/(root)/_lib/enrollment.schemas";

/**
 * Translation-key maps for enrollment status and mode. Keeping the mapping in
 * one place means the status labels defined in the feature doc stay consistent
 * everywhere they appear (discover cards, pending requests, class requests).
 */
export const enrollmentStatusLabelKeys: Record<EnrollmentStatus, string> = {
  PENDING: "root.enrollment.status.pending",
  ACTIVE: "root.enrollment.status.active",
  REJECTED: "root.enrollment.status.rejected",
  CANCELLED: "root.enrollment.status.cancelled",
  REMOVED: "root.enrollment.status.removed",
  COMPLETED: "root.enrollment.status.completed",
};

export const enrollmentModeLabelKeys: Record<EnrollmentMode, string> = {
  REQUEST_APPROVAL: "root.enrollment.mode.requestApproval",
  DIRECT_ASSIGNMENT: "root.enrollment.mode.directAssignment",
  OPEN: "root.enrollment.mode.open",
};
