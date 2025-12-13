import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  searchProducts,
} from "../api/product";
import { ProductCreateDto, ProductReadDto } from "../types/product";

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

  const loadProducts = async () => {
    setProducts(await getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async () => {
    await createProduct(form);
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    });
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleSearch = async () => {
    if (!query) return loadProducts();
    setProducts(await searchProducts(query));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h3>Create Product</h3>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Description" onChange={e => setForm({...form, description: e.target.value})}/>
      <input type="number" placeholder="Price" onChange={e => setForm({...form, price: +e.target.value})}/>
      <input type="number" placeholder="Stock" onChange={e => setForm({...form, stock: +e.target.value})}/>
      <input placeholder="Category" onChange={e => setForm({...form, category: e.target.value})}/>
      <button onClick={handleCreate}>Create</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
