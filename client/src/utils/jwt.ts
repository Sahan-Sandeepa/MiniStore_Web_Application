import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  // Role claim
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | "Admin"
    | "Customer";

  // UserId claim
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
};

export function getRoleFromToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  return (
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    null
  );
}

export function getUserIdFromToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  return (
    decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ?? null
  );
}
