type Props = {
  open: boolean;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmOrderModal({
  open,
  total,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96">
        <h2 className="text-xl font-semibold mb-3">Confirm Order</h2>

        <p className="text-sm mb-4 text-gray-500">
          You are about to place an order worth:
        </p>

        <p className="text-2xl font-bold mb-6">${total.toFixed(2)}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
