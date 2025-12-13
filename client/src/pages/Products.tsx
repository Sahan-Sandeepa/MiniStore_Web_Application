import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct, searchProducts } from "../api/product";
import { ProductCreateDto, ProductReadDto } from "../types/product";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ProductCreateDto>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill in name, price, and stock!");
      return;
    }

    setLoading(true);
    try {
      await createProduct(form);
      toast.success("Product created!");
      setForm({ name: "", description: "", price: 0, stock: 0, category: "" });
      loadProducts();
    } catch {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!query) return loadProducts();
      const data = await searchProducts(query);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          Search
        </button>
      </div>

      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Create Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock || ""}
            onChange={(e) => setForm({ ...form, stock: +e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="col-span-1 md:col-span-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{p.category}</p>
              <p className="mt-1">${p.price.toFixed(2)}</p>
              <p className="mt-1">Stock: {p.stock}</p>
              <p className="mt-1 text-sm">{p.description}</p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
