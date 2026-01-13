import { ProductReadDto } from "../types/product";

interface ProductDetailsModalProps {
  product: ProductReadDto;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductReadDto) => void;
}

export function ProductDetailsModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-xl w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {product.description}
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 text-xl font-semibold">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl"
            >
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-700 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
