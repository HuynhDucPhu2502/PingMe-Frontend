import {
  getCurrentUserSessionApi,
  loginLocalApi,
  logoutApi,
  refreshSessionApi,
} from "@/services/authApi";
import type {
  DefaultAuthResponse,
  LocalLoginRequest,
  UserSessionResponse,
} from "@/types/user";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const login = createAsyncThunk<
  DefaultAuthResponse,
  LocalLoginRequest,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginLocalApi(data);
    toast.success("Đăng nhập thành công");
    return res.data.data;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Đăng nhập thất bại");
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutApi();
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Đăng xuất thất bại");
    return thunkAPI.rejectWithValue(message);
  }
});

export const refreshSession = createAsyncThunk<
  DefaultAuthResponse,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, thunkAPI) => {
  try {
    const res = await refreshSessionApi();
    return res.data.data;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Làm mới phiên đăng nhập thất bại");
    return thunkAPI.rejectWithValue(message);
  }
});

export const getCurrentUserSession = createAsyncThunk<
  UserSessionResponse,
  void,
  { rejectValue: string }
>("auth/me", async (_, thunkAPI) => {
  try {
    const res = await getCurrentUserSessionApi();
    return res.data.data;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Lấy thông tin tài khoản thất bại");
    return thunkAPI.rejectWithValue(message);
  }
});
