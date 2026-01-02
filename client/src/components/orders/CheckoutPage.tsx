import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = async () => {
    // Later → API call
    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Total: ${total.toFixed(2)}</p>

      <button
        onClick={placeOrder}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Place Order
      </button>
    </div>
  );
}
