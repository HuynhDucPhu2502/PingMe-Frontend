import axiosClient from "@/lib/axiosClient.ts";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { UserSummaryResponse } from "@/types/common/userSummary";

export const lookupApi = (email: string) => {
  return axiosClient.get<ApiResponse<UserSummaryResponse>>(
    `/users/lookup/${email}`
  );
};
