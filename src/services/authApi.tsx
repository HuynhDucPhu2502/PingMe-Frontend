import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  DefaultAuthResponseDto,
  UserLoginRequestDto,
  UserSession,
} from "@/types/user";
import axios from "axios";

export const loginLocalApi = (data: UserLoginRequestDto) => {
  return axiosClient.post<ApiResponse<DefaultAuthResponseDto>>(
    "/auth/login",
    data
  );
};

export const logoutApi = () => {
  return axios.post(
    "http://localhost:8080/auth/logout",
    {},
    { withCredentials: true }
  );
};

export const refreshSessionApi = () => {
  return axios.post<ApiResponse<DefaultAuthResponseDto>>(
    "http://localhost:8080/auth/refresh",
    {},
    { withCredentials: true }
  );
};

export const getCurrentUserSessionApi = () => {
  return axiosClient.get<ApiResponse<UserSession>>("/auth/me");
};
