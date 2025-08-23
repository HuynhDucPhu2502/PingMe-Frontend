import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import type { AppDispatch } from "@/features/store";
import type { ApiResponse } from "@/types/apiResponse";
import { refreshSessionApi } from "@/services/userAccountApi.ts";
import { updateTokenManually } from "@/features/slices/authSlice";
import { getCurrentUserSession, logout } from "@/features/slices/authThunk";

// ============================================================
// Setup dispatch từ store để sử dụng
// trong đây
// ============================================================
let dispatchRef: AppDispatch;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

// ============================================================
// Cấu hình mặc định cho các request
// ============================================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

// ============================================================
// Interceptor: Tự động gắn Access Token vào mỗi request
// CHO TRƯỜNG HỢP ACCESS TOKEN ĐƯỢC LƯU Ở LOCAL STORAGE
// ============================================================
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ============================================================
// Cơ chế hàng đợi xử lý request bị lỗi 401 trong khi refresh token:
// - failedQueue lưu các request bị 401
// - Khi refresh thành công → resolve queue
// - Khi refresh fail → reject toàn bộ queue
// ============================================================
type FailedRequest = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve();
    else reject(error);
  });
  failedQueue = [];
};

// ============================================================
// Interceptor: Xử lý lỗi 401 và errorCode UNAUTHORIZED
// ============================================================

let isRefreshing = false;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check lỗi có phải thuộc lại lỗi JWT Token
    const { response } = error;

    const responseErrorCode = (response?.data as ApiResponse<unknown>)
      ?.errorCode;
    const responseStatus = response?.status;

    const isUnauthorized =
      responseStatus === 401 && responseErrorCode.includes("INVALID_JWT_TOKEN");

    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest)) // trigger khi resolve()
          .catch((err) => Promise.reject(err)); // trigger khi reject()
      }

      isRefreshing = true;

      try {
        const res = (await refreshSessionApi()).data.data;

        const accessToken = res.accessToken;
        if (dispatchRef) {
          dispatchRef(updateTokenManually(res));
          dispatchRef(getCurrentUserSession());
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        dispatchRef(logout());
        processQueue(refreshError, null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================

export default axiosClient;
