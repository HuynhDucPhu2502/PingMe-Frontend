import {
  getCurrentUserSessionApi,
  loginLocalApi,
  refreshSessionApi,
} from "@/services/authApi";
import type {
  DefaultAuthResponseDto,
  UserLoginRequestDto,
  UserSession,
} from "@/types/user";
import { getErrorMessage } from "@/utils/errorMessageHandler";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const login = createAsyncThunk<
  DefaultAuthResponseDto,
  UserLoginRequestDto,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginLocalApi(data);
    return res.data.data;
  } catch (err: unknown) {
    const message = getErrorMessage(err, "Đăng nhập thất bại");
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const refreshSession = createAsyncThunk<
  DefaultAuthResponseDto,
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
  UserSession,
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
