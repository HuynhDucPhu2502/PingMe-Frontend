import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  ChangePasswordRequest,
  ChangeProfileRequest,
  DefaultAuthResponse,
  LoginRequest,
  RegisterRequest,
  CurrentUserSessionMetaResponse,
  CurrentUserProfileResponse,
  CurrentUserSessionResponse,
} from "@/types/authentication";
import { getSessionMetaRequest } from "@/utils/sessionMetaHandler.ts";
import axios from "axios";

export const registerLocalApi = (data: RegisterRequest) => {
  return axios.post<ApiResponse<DefaultAuthResponse>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/register`,
    data,
    { withCredentials: true }
  );
};

export const loginLocalApi = (data: LoginRequest) => {
  const sessionMetaRequest = getSessionMetaRequest();

  return axios.post<ApiResponse<DefaultAuthResponse>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
    {
      ...data,
      sessionMetaRequest,
    },
    { withCredentials: true }
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
  const sessionMetaRequest = getSessionMetaRequest();
  return axios.post<ApiResponse<DefaultAuthResponse>>(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
    sessionMetaRequest,
    { withCredentials: true }
  );
};

export const getCurrentUserSessionApi = () => {
  return axiosClient.get<ApiResponse<CurrentUserSessionResponse>>("/auth/me");
};

export const getCurrentUserInfoApi = () => {
  return axiosClient.get<ApiResponse<CurrentUserProfileResponse>>("/auth/me/info");
};

export const getCurrentUserAllDeviceMetasApi = () => {
  return axiosClient.get<ApiResponse<CurrentUserSessionMetaResponse[]>>(
    "/auth/me/sessions"
  );
};

export const updateCurrentUserPasswordApi = (
  changePasswordRequest: ChangePasswordRequest
) => {
  return axiosClient.post<ApiResponse<CurrentUserSessionResponse>>(
    "/auth/me/password",
    changePasswordRequest
  );
};

export const updateCurrentUserProfileApi = (
  changeProfileRequest: ChangeProfileRequest
) => {
  return axiosClient.post<ApiResponse<CurrentUserSessionResponse>>(
    "/auth/me/profile",
    changeProfileRequest
  );
};

export const updateCurrentUserAvatarApi = (data: FormData) => {
  return axiosClient.post<ApiResponse<CurrentUserSessionResponse>>(
    "/auth/me/avatar",
    data
  );
};

export const deleteCurrentUserDeviceMetaApi = (sessionId: string) => {
  return axiosClient.delete<ApiResponse<CurrentUserSessionResponse>>(
    `/auth/me/sessions/${sessionId}`
  );
};
