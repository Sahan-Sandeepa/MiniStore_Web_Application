import axiosInstance from "./axios";

export const register = async (data: {
  userName: string;
  fullName: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const login = async (data: { userName: string; password: string }) => {
  const res = await axiosInstance.post("/auth/login", data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("refreshToken", res.data.refreshToken);
  return res.data;
};

export const logout = () => {
  localStorage.clear();
};
