import axiosInstance from "./axios";
import { AdminUserDto } from "../types/user";

export const getAllUsers = async () => {
  const res = await axiosInstance.get<AdminUserDto[]>("/admin/users");
  return res.data;
};

export const disableUser = async (id: string) => {
  await axiosInstance.put(`/admin/users/${id}/disable`);
};

export const enableUser = async (id: string) => {
  await axiosInstance.put(`/admin/users/${id}/enable`);
};

export const deleteUser = async (id: string) => {
  await axiosInstance.delete(`/admin/users/${id}`);
};
