import axios from "axios";

const API_URL = "http://localhost:5298/api/auth";

export const register = async (data: {
  userName: string;
  fullName: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const login = async (data: { userName: string; password: string }) => {
  const res = await axios.post(`${API_URL}/login`, data);
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("refreshToken", res.data.refreshToken);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
};
