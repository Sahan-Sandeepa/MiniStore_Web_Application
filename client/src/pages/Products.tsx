import React, { useState, useEffect } from "react";
import { ProductReadDto, ProductCreateDto } from "../types/product";
import { getProducts, createProduct, updateProduct, deleteProduct, searchProducts } from "../api/product";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductReadDto[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductReadDto | null>(null);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    const data = search ? await searchProducts(search) : await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleCreate = async (data: ProductCreateDto) => {
    await createProduct(data);
    setEditingProduct(null);
    loadProducts();
  };

  const handleUpdate = async (data: ProductCreateDto) => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, data);
    setEditingProduct(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={() => setEditingProduct({} as ProductReadDto)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          Add Product
        </button>
      </div>

      {(editingProduct || editingProduct === {} as ProductReadDto) && (
        <ProductForm
          initialData={editingProduct !== {} as ProductReadDto ? editingProduct : undefined}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onEdit={setEditingProduct} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Products;
