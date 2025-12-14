import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  role: "Admin" | "Customer" | null;
  login: (token: string, role: "Admin" | "Customer") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState<"Admin" | "Customer" | null>(
    localStorage.getItem("role") as "Admin" | "Customer" | null
  );

  const login = (token: string, role: "Admin" | "Customer") => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
