import axiosInstance from "./axios";

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/mine");
  return res.data;
};

export const createOrder = async (items: any[]) => {
  await axiosInstance.post("/orders", { items });
};
