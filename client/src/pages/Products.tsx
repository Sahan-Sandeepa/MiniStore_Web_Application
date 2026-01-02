import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  searchProducts,
  updateProduct,
} from "../api/product";
import { ProductCreateDto, ProductReadDto } from "../types/product";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
  const [editingProduct, setEditingProduct] = useState<ProductReadDto | null>(
    null
  );
  const [editForm, setEditForm] = useState<ProductCreateDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { role } = useAuth();
  const isAdmin = role === "Admin";

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

  const handleUpdate = async () => {
    if (!editingProduct || !editForm) return;

    if (!editForm.name || editForm.price <= 0 || editForm.stock < 0) {
      toast.error("Invalid product details");
      return;
    }

    setLoading(true);
    try {
      await updateProduct(editingProduct.id, editForm);
      toast.success("Product updated");
      setIsEditOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product: ProductReadDto) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Dashboard</h1>
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

      {isAdmin && (
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
      )}

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

            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditOpen && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold">Edit Product</h2>

            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="Name"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />

            <input
              value={editForm.category}
              onChange={(e) =>
                setEditForm({ ...editForm, category: e.target.value })
              }
              placeholder="Category"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />

            <input
              type="number"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: +e.target.value })
              }
              placeholder="Price"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />

            <input
              type="number"
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({ ...editForm, stock: +e.target.value })
              }
              placeholder="Stock"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />

            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Description"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
