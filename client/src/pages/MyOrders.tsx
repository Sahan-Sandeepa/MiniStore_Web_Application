import { useEffect, useState } from "react";
import { cancelOrder, getMyOrders } from "../api/orders";
import { OrderReadDto } from "../types/order";
import { toast, Toaster } from "react-hot-toast";

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-semibold">
                    Order ID - {order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-4 rounded-full text-sm font-medium
                    ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {order.status}
                </span>

                {(order.status === "Pending" ||
                  order.status === "Processing") && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 font-semibold">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
