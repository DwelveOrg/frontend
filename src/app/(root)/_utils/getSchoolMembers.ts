import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  getSchoolMembersRequest,
  type SchoolMembersResponse,
} from "@/app/(authentication)/_lib/api";

export async function getSchoolMembers(
  schoolId: string,
): Promise<SchoolMembersResponse | null> {
  try {
    return await getSchoolMembersRequest(schoolId, authedBackendJson);
  } catch {
    return null;
  }
}
