import api from "./axios";

export const login = (data: { userName: string; password: string }) =>
  api.post("/auth/login", data);

export const register = (data: {
  userName: string;
  fullName: string;
  password: string;
}) => api.post("/auth/register", data);

export const me = () => api.get("/auth/me");
