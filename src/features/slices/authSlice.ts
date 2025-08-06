import type { UserSession } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserSession, login, refreshSession } from "./authThunk";

export type AuthState = {
  userSession: UserSession;
  isLogin: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialValue: AuthState = {
  userSession: {} as UserSession,
  isLogin: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialValue,
  reducers: {
    updateTokenManually(state, action) {
      state.userSession = action.payload.user;
      localStorage.setItem("access_token", action.payload.accessToken);
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userSession = action.payload.userSession;
        localStorage.setItem("access_token", action.payload.accessToken);

        state.isLogin = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })

      // REFRESH TOKEN
      .addCase(refreshSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.userSession = action.payload.userSession;
        localStorage.setItem("access_token", action.payload.accessToken);

        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;

        localStorage.removeItem("access_token");
        state.isLogin = false;
      })

      // GET CURRENT SESSION
      .addCase(getCurrentUserSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserSession.fulfilled, (state, action) => {
        state.userSession = action.payload;

        state.isLogin = true;
        state.isLoading = false;
      })
      .addCase(getCurrentUserSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ===========================================
// EXPORT REDUCER
// ===========================================
export const { updateTokenManually } = authSlice.actions;
export default authSlice.reducer;
