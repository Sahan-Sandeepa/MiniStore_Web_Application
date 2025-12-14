import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { JSX } from "react";

export default function RequireRole({
  role,
  children,
}: {
  role: string;
  children: JSX.Element;
}) {
  const auth = useAuth();

  if (!auth.token) return <Navigate to="/login" />;
  if (auth.role !== role) return <Navigate to="/unauthorized" />;

  return children;
}
