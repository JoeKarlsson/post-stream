import { jwtDecode } from "jwt-decode";

// True when the token's `exp` has passed, or the token can't be read at all
// (a corrupted token in localStorage must log the user out, not crash the app)
export function isTokenExpired(token: string, now: Date = new Date()): boolean {
  let exp: number | undefined;
  try {
    exp = jwtDecode(token).exp;
  } catch {
    return true;
  }
  if (exp === undefined) {
    return false;
  }
  return exp * 1000 <= now.getTime();
}
