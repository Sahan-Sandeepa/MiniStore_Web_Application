import axiosInstance from "./axios";
import { OrderReadDto } from "../types/order";

export const getMyOrders = async () => {
  const res = await axiosInstance.get<OrderReadDto[]>("/orders/my");
  return res.data;
};
