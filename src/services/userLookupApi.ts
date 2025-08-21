import axiosClient from "@/lib/axiosClient.ts";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserSummaryResponse } from "@/types/userSummary";

export const lookupApi = (email: string) => {
  return axiosClient.get<ApiResponse<UserSummaryResponse>>(
    `/users/lookup/${email}`
  );
};
