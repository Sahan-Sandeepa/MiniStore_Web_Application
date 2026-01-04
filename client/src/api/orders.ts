import axiosInstance from "./axios";

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/mine");
  return res.data;
};

export const createOrder = async (items: any[]) => {
  const payload = items.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  await axiosInstance.post("/orders", { items: payload });
};

export const cancelOrder = async (orderId: string) => {
  await axiosInstance.patch(`/orders/${orderId}/cancel`);
};

export const deleteOrder = async (orderId: string) => {
  await axiosInstance.delete(`/orders/${orderId}`);
};
