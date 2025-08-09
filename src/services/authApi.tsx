import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  DefaultAuthResponseDto,
  UserLoginLocalRequestDto,
  UserRegisterLocalRequestDto,
  UserSessionResponseDto,
} from "@/types/user";
import axios from "axios";

export const registerLocalApi = (data: UserRegisterLocalRequestDto) => {
  return axios.post<ApiResponse<DefaultAuthResponseDto>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/register`,
    data,
    { withCredentials: true }
  );
};

export const loginLocalApi = (data: UserLoginLocalRequestDto) => {
  return axiosClient.post<ApiResponse<DefaultAuthResponseDto>>(
    "/auth/login",
    data
  );
};

export const logoutApi = () => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
};

export const refreshSessionApi = () => {
  return axios.post<ApiResponse<DefaultAuthResponseDto>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
};

export const getCurrentUserSessionApi = () => {
  return axiosClient.get<ApiResponse<UserSessionResponseDto>>("/auth/me");
};
