import { useState } from "react";
import { useCart } from "../../components/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ConfirmOrderModal from "../../components/ConfirmOrderModal";
import { createOrder } from "../../api/orders";

export default function CheckoutPage() {
  const { items, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "COD">("CARD");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirm = async () => {
    try {
      setPlacingOrder(true);
      await createOrder(items);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
      setShowConfirm(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              John Doe <br />
              123 Main Street <br />
              Colombo, Sri Lanka
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">
              {[
                { key: "CARD", label: "Credit / Debit Card" },
                { key: "COD", label: "Cash on Delivery" },
              ].map((method) => (
                <label
                  key={method.key}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                    ${
                      paymentMethod === method.key
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                >
                  <span className="text-sm font-medium">{method.label}</span>
                  <input
                    type="radio"
                    checked={paymentMethod === method.key}
                    onChange={() =>
                      setPaymentMethod(method.key as "CARD" | "COD")
                    }
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name} × {item.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.success(`Removed ${item.name} from cart`);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={placingOrder}
            onClick={() => setShowConfirm(true)}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </aside>

        <ConfirmOrderModal
          open={showConfirm}
          total={total}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
