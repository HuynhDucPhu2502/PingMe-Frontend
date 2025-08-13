import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse";
import type {
  ChangePasswordRequest,
  ChangeProfileRequest,
  DefaultAuthResponse,
  LocalLoginRequest,
  LocalRegisterRequest,
  UserDetailResponse,
  UserSessionResponse,
} from "@/types/user";
import axios from "axios";

export const registerLocalApi = (data: LocalRegisterRequest) => {
  return axios.post<ApiResponse<DefaultAuthResponse>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/register`,
    data,
    { withCredentials: true }
  );
};

export const loginLocalApi = (data: LocalLoginRequest) => {
  return axiosClient.post<ApiResponse<DefaultAuthResponse>>(
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
  return axios.post<ApiResponse<DefaultAuthResponse>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
};

export const getCurrentUserSessionApi = () => {
  return axiosClient.get<ApiResponse<UserSessionResponse>>("/auth/me");
};

export const getCurrentUserDetail = () => {
  return axiosClient.get<ApiResponse<UserDetailResponse>>("/auth/me/detail");
};

export const updateCurrentUserPassword = (
  changePasswordRequest: ChangePasswordRequest
) => {
  return axiosClient.post<ApiResponse<UserSessionResponse>>(
    "/auth/me/password",
    changePasswordRequest
  );
};

export const updateCurrentUserProfile = (
  changeProfileRequest: ChangeProfileRequest
) => {
  return axiosClient.post<ApiResponse<UserSessionResponse>>(
    "/auth/me/profile",
    changeProfileRequest
  );
};
