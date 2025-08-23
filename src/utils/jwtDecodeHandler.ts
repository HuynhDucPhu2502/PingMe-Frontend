import { jwtDecode } from "jwt-decode";

type Decoded = { exp: number };
export function isExpiringSoon(token: string, skewSec = 30) {
  const { exp } = jwtDecode<Decoded>(token);
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= skewSec;
}
