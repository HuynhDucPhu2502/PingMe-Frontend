import type { ApiResponse } from "@/types/apiResponse";
import axios from "axios";

export const getErrorMessage = (
  err: unknown,
  fallbackMessage = "Thao tác thất bại"
): string => {
  console.log(err);
  if (axios.isAxiosError(err)) {
    const res = err.response?.data as ApiResponse<unknown>;

    return res?.errorCode || fallbackMessage;
  }

  return fallbackMessage;
};
