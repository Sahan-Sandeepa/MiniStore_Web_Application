import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
    | "Admin"
    | "Customer";
};

export function getRoleFromToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  return (
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    null
  );
}
