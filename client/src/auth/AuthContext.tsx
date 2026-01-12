import { createContext, useContext, useState } from "react";
import { getRoleFromToken, getUserIdFromToken } from "../utils/jwt";

type Role = "Admin" | "Customer";

type AuthContextType = {
  token: string | null;
  role: Role | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<Role | null>(
    token ? getRoleFromToken(token) : null
  );

  const [userId, setUserId] = useState<string | null>(
    token ? getUserIdFromToken(token) : null
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUserId(getUserIdFromToken(token));
    setRole(getRoleFromToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
