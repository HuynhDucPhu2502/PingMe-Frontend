import { jwtDecode } from "jwt-decode";
import type { DefaultAuthResponse } from "@/types/userAccount";
import axios from "axios";

type Decoded = { exp: number };
export function isExpiringSoon(token: string, skewSec = 30) {
  const { exp } = jwtDecode<Decoded>(token);
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= skewSec;
}

export type ValidTokenResult =
  | { type: "cached"; accessToken: string }
  | { type: "refreshed"; accessToken: string; payload: DefaultAuthResponse };

export const getValidAccessToken = async (): Promise<ValidTokenResult> => {
  const current = localStorage.getItem("access_token");
  if (!current || isExpiringSoon(current)) {
    const resp = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const payload = resp.data.data as DefaultAuthResponse;
    localStorage.setItem("access_token", payload.accessToken);
    return { type: "refreshed", accessToken: payload.accessToken, payload };
  }
  return { type: "cached", accessToken: current };
};
