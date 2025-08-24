import { jwtDecode } from "jwt-decode";
import { refreshSessionApi } from "@/services/userAccountApi.ts";
import type { DefaultAuthResponse } from "@/types/userAccount";

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
  const currentAccessToken = localStorage.getItem("access_token");

  if (!currentAccessToken || isExpiringSoon(currentAccessToken)) {
    const res = (await refreshSessionApi()).data.data;

    const newAccessToken = res.accessToken;
    localStorage.setItem("access_token", newAccessToken);

    return { type: "refreshed", accessToken: newAccessToken, payload: res };
  }

  return { type: "cached", accessToken: currentAccessToken };
};
