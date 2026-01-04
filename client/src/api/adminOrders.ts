import axiosInstance from "./axios";
import { AdminOrderReadDto } from "../types/order";

export const getAllOrders = async () => {
  const res = await axiosInstance.get<AdminOrderReadDto[]>("/orders");
  return res.data;
};

export const searchOrders = async (query: string) => {
  const res = await axiosInstance.get<AdminOrderReadDto[]>(
    `/orders/search?query=${query}`
  );
  return res.data;
};
