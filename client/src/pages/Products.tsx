import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id}>
          <b>{p.name}</b> - {p.price}
        </div>
      ))}
    </div>
  );
}
