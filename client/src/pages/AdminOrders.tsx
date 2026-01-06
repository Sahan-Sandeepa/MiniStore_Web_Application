import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { AdminOrderReadDto } from "../types/order";
import { Toaster, toast } from "react-hot-toast";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Completed",
  "Cancelled",
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

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
      await axiosInstance.patch(`/Orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      loadOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      await axiosInstance.delete(`/Orders/${orderId}`);
      toast.success("Order deleted");
      loadOrders();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to delete order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Orders
          </h1>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              placeholder="Search by order ID or username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 sm:w-72 px-4 py-2 rounded-xl border
                         bg-white dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              Search
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-20">
            <span className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl shadow">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">{order.userName}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
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
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${statusStyles[order.status]} dark:bg-opacity-20`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {(order.status === "Cancelled" ||
                        order.status === "Completed") && (
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{order.id.slice(0, 8)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {order.userName} •{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="text-sm space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-gray-700"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {(order.status === "Cancelled" ||
                  order.status === "Completed") && (
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="w-full py-2 bg-red-100 text-red-700 rounded-xl"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
