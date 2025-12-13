import { useEffect, useState } from "react";
import API from "../api/axios";
import { ProductReadDto } from "../types/product";

const Products = () => {
  const [products, setProducts] = useState<ProductReadDto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/Product");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load products. Please login.");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((p) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
