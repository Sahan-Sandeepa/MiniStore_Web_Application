import { useState } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmOrderModal from "../ConfirmOrderModal";
import { createOrder } from "../../api/orders";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirm = async () => {
    try {
      await createOrder(items);
      toast.success("Order placed successfully!");
      clearCart();
      setShowConfirm(false);
      navigate("/my-orders");
    } catch {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => setShowConfirm(true)}
            className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Place Order
          </button>
        </>
      )}

      <ConfirmOrderModal
        open={showConfirm}
        total={subtotal}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
