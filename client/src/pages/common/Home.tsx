import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useCart } from "../../components/CartContext";
import { ProductReadDto } from "../../types/product";
import { ProductDetailsModal } from "../../components/ProductDetailsModal";
import { fetchExternalProducts } from "../../api/external";

const categories = [
  "All",
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

export default function HomePage() {
  const { role, token } = useAuth();
  const isAdmin = role === "Admin";
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"PRICE_LOW" | "PRICE_HIGH">("PRICE_LOW");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductReadDto | null>(
    null
  );

  const [wishlist, setWishlist] = useState<string[]>([]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      setProducts(await fetchExternalProducts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products
    .filter(
      (p) => category === "All" || p.category === category || category === ""
    )
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortBy === "PRICE_LOW" ? a.price - b.price : b.price - a.price
    );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleAddToCart = (product: ProductReadDto) => {
    if (!token) {
      toast("Login required to add to cart");
      navigate("/login", {
        state: { redirectTo: "/checkout", prefilledCart: [product] },
      });
      return;
    }
    setSelectedProduct(product);
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
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
              onClick={() => navigate("/admin/products/new")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            >
              + New Product
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="ml-auto px-3 py-1 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border dark:border-gray-700 rounded px-2 py-1 dark:bg-gray-700"
          >
            <option value="PRICE_LOW">Price Low → High</option>
            <option value="PRICE_HIGH">Price High → Low</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 flex flex-col hover:shadow-lg transition"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded-lg"
                />
                <div className="flex justify-between mt-2 items-center">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 px-2 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold">
                    ${p.price.toFixed(2)}
                  </span>
                  {!isAdmin && (
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      {wishlist.includes(p.id) ? "♥" : "♡"}
                    </button>
                  )}
                </div>
                {!isAdmin && (
                  <button
                    disabled={p.stock <= 0}
                    onClick={() => handleAddToCart(p)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length > perPage && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-3 py-1">{page}</span>
            <button
              onClick={() =>
                setPage((p) =>
                  p * perPage < filteredProducts.length ? p + 1 : p
                )
              }
              disabled={page * perPage >= filteredProducts.length}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedProduct && modalOpen && (
        <ProductDetailsModal
          product={selectedProduct}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddToCart={confirmAddToCart}
        />
      )}
    </div>
  );
}
