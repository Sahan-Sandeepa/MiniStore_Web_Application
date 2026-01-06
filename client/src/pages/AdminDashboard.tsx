import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/product";
import { ProductReadDto } from "../types/product";
import { toast } from "react-hot-toast";
import {
  ChartBarIcon,
  PlusCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const stockDistribution = products.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview & quick management actions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow flex flex-col items-start">
          <ChartBarIcon className="h-8 w-8 text-indigo-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : totalProducts}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow flex flex-col items-start">
          <ChartBarIcon className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Total Stock</p>
          <p className="text-2xl font-bold">{loading ? "..." : totalStock}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow flex flex-col items-start">
          <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Inventory Value</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : `$${inventoryValue.toFixed(2)}`}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Stock Distribution</h2>
        {loading ? (
          <p>Loading chart...</p>
        ) : stockDistribution.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {stockDistribution.map((p) => {
              const percentage = totalStock ? (p.stock / totalStock) * 100 : 0;
              return (
                <div key={p.name} className="flex flex-col">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{p.name}</span>
                    <span>{p.stock}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/products")}
          className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl p-6 shadow flex items-center gap-4 transition"
        >
          <PlusCircleIcon className="h-10 w-10" />
          <div>
            <h3 className="text-lg font-semibold">Add / Manage Products</h3>
            <p className="text-sm">
              Create new products or update existing inventory
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white rounded-2xl p-6 shadow flex items-center gap-4 transition"
        >
          <ClipboardIcon className="h-10 w-10" />
          <div>
            <h3 className="text-lg font-semibold">Manage Orders</h3>
            <p className="text-sm">View and update customer orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
