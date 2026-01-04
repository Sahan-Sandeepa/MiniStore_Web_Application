import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { AdminOrderReadDto } from "../types/order";
import { Toaster, toast } from "react-hot-toast";

const ORDER_STATUSES = [
  "Pending",
  "Approved",
  "Shipped",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrderReadDto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<AdminOrderReadDto[]>("/Orders");
      setOrders(res.data);
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
      const res = await axiosInstance.get<AdminOrderReadDto[]>(
        `/Orders?search=${query}`
      );
      setOrders(res.data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await axiosInstance.put(`/Orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      loadOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Admin Orders Dashboard
      </h1>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Search by order ID or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <span className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <thead>
              <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">{order.userName}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="px-2 py-1 rounded-lg border dark:bg-gray-700"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
