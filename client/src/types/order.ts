export type OrderItemDto = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

export type OrderReadDto = {
  id: string;
  createdAt: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  totalAmount: number;
  items: OrderItemDto[];
};

export type AdminOrderReadDto = {
  id: string;
  userName: string;
  createdAt: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  totalAmount: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
};
