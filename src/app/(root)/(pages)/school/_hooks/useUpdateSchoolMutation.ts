"use client";

import { useMutation } from "@tanstack/react-query";

import { updateSchoolAction } from "@/app/(root)/_lib/school-actions";
import type { UpdateSchoolInput } from "@/app/(root)/_lib/actions.schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";

export function useUpdateSchoolMutation() {
  return useMutation({
    mutationFn: async (input: UpdateSchoolInput) => {
      const result = await updateSchoolAction(input);
      return readSafeActionData(result, "Could not update the school. Please try again.");
    },
  });
}
