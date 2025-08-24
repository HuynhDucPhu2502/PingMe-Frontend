import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError } from "axios";
import type { ApiResponse } from "@/types/apiResponse";
import { logout } from "@/features/slices/authThunk";
import { type AppDispatch } from "@/features/store.ts";
import { getValidAccessToken } from "@/utils/jwtDecodeHandler";
import { updateTokenManually } from "@/features/slices/authSlice";

// ============================================================
// Cấu hình cơ bản
// ============================================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

let dispatchRef: AppDispatch | null = null;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  dispatchRef = dispatch;
};

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
// Response Interceptor
// ============================================================
let isRefreshing = false;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const { response } = error;

    const payload = response?.data as ApiResponse<unknown> | undefined;
    const code = payload?.errorCode ?? "";
    const responseStatus = response?.status;
    const isUnauthorized =
      responseStatus === 401 &&
      (code === "INVALID_JWT_TOKEN" || code.includes?.("INVALID_JWT_TOKEN"));

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
        const result = await getValidAccessToken();

        if (result.type === "refreshed" && dispatchRef != null)
          dispatchRef(updateTokenManually(result.payload));

        const accessToken = result.accessToken;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (dispatchRef != null) dispatchRef(logout());
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
// Request Interceptor
// ============================================================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
