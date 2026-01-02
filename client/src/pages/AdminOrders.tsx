import { useEffect, useState } from "react";
import { getAllOrders, searchOrders } from "../api/adminOrders";
import { AdminOrderReadDto } from "../types/order";
import { Toaster, toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrderReadDto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!query) return loadOrders();
      const data = await searchOrders(query);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Orders Management
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Search by order ID or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <span className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.userName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700">
                  {order.status}
                </span>
              </div>

              <div className="divide-y text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-3 font-semibold">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
