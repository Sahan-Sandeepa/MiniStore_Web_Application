import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/product";
import { ProductReadDto } from "../types/product";
import { toast } from "react-hot-toast";
import { DashboardCard, ActionCard } from "../components/Cards";
// import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { logout } = useAuth();

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

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // const handleLogout = () => {
  //   logout();
  //   toast.success("Logged out");
  //   navigate("/login");
  // };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview & quick management actions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Products"
          value={products.length}
          loading={loading}
        />
        <DashboardCard
          title="Total Stock"
          value={totalStock}
          loading={loading}
        />
        <DashboardCard
          title="Inventory Value"
          value={`$${totalValue.toFixed(2)}`}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Manage Products"
          description="View, edit, or delete existing products"
          onClick={() => navigate("/products")}
          color="indigo"
        />
        <ActionCard
          title="Manage Orders"
          description="View customer orders and order history"
          onClick={() => navigate("/admin/orders")}
          color="purple"
        />
        <ActionCard
          title="Add New Product"
          description="Create a new product in inventory"
          onClick={() => navigate("/products")}
          color="green"
        />
      </div>

      {/* <div className="mt-12 flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div> */}
    </div>
  );
}
