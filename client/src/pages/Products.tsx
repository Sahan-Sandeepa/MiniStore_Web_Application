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
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../components/CartContext";
import ProductForm from "../components/ProductForm";
import ConfirmOrderModal from "../components/ConfirmOrderModal";

export default function Products() {
  const { role } = useAuth();
  const { addToCart } = useCart();
  const isAdmin = role === "Admin";
  console.log(role);
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "order" | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductReadDto | null>(
    null
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductReadDto | null>(
    null
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await getProducts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product: ProductReadDto) => {
    if (product.stock <= 0) return;
    setSelectedProduct(product);
    setModalAction("order");
    setModalOpen(true);
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p
      )
    );
    toast.success("Added to cart");
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!query) return loadProducts();
      setProducts(await searchProducts(query));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: ProductCreateDto) => {
    setLoading(true);
    try {
      await createProduct(data);
      toast.success("Product created");
      setFormOpen(false);
      loadProducts();
    } catch {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: ProductCreateDto) => {
    if (!editingProduct) return;
    setLoading(true);
    try {
      await updateProduct(editingProduct.id, data);
      toast.success("Product updated");
      setFormOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product: ProductReadDto) => {
    setSelectedProduct(product);
    setModalAction("delete");
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Delete failed");
    } finally {
      setModalOpen(false);
      setSelectedProduct(null);
      setModalAction(null);
      setLoading(false);
    }
  };

  const openEditForm = (product: ProductReadDto) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">
            {isAdmin ? "Product Management" : "Products"}
          </h1>

          {isAdmin && (
            <button
              onClick={() => setFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            >
              + New Product
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700
                       bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-500">
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No products found
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col hover:shadow-lg transition"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 px-2 py-1 rounded-full">
                  {p.category}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                {p.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">${p.price.toFixed(2)}</span>
                {isAdmin && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Stock: {p.stock}
                  </span>
                )}
              </div>

              {!isAdmin && (
                <button
                  disabled={p.stock <= 0}
                  onClick={() => handleAddToCart(p)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              )}

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditForm(p)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ProductForm
            initialData={editingProduct ?? undefined}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {modalOpen && selectedProduct && modalAction && (
        <ConfirmOrderModal
          open={modalOpen}
          total={selectedProduct.price}
          onCancel={() => {
            setModalOpen(false);
            setSelectedProduct(null);
            setModalAction(null);
          }}
          onConfirm={
            modalAction === "delete" ? confirmDelete : confirmAddToCart
          }
          message={
            modalAction === "delete"
              ? `Are you sure you want to delete "${selectedProduct.name}"?`
              : `Confirm adding "${
                  selectedProduct.name
                }" to cart for $${selectedProduct.price.toFixed(2)}?`
          }
        />
      )}
    </div>
  );
}
