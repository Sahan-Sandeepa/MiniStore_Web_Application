import React from "react";
import { ProductReadDto } from "../types/product";

interface Props {
  product: ProductReadDto;
  onEdit: (product: ProductReadDto) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="font-semibold">Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.category}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
