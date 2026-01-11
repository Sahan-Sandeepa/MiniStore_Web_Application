import { useEffect, useState } from "react";
import { cancelOrder, getMyOrders } from "../../api/orders";
import { OrderReadDto } from "../../types/order";
import { toast, Toaster } from "react-hot-toast";

const statusStyles: Record<string, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Shipped:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getMyOrders());
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (cancellingId) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
    );

    setCancellingId(orderId);

    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
    } catch {
      toast.error("Cancel failed");
      loadOrders();
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <span className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        {orders.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            You haven’t placed any orders yet.
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel =
              order.status === "Pending" || order.status === "Processing";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      Order ID ➡️ {order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>

                    {canCancel && (
                      <button
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y dark:divide-gray-700">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end text-lg font-semibold">
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
