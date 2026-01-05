import React from "react";
import { ProductReadDto } from "../types/product";

interface Props {
  product: ProductReadDto;
  onEdit: (product: ProductReadDto) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<Props> = ({
  product,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {product.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {product.description}
        </p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">
          Price: ${product.price}
        </p>
        {isAdmin && (
          <p className="text-gray-500 dark:text-gray-400">
            Stock: {product.stock}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400">
          Category: {product.category}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
