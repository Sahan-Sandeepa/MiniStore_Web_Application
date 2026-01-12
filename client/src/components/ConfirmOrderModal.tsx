type Props = {
  open: boolean;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
};

export default function ConfirmOrderModal({
  open,
  total,
  onConfirm,
  onCancel,
  message,
  title = "Confirmation",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: Props) {
  if (!open) return null;

  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-indigo-600 hover:bg-indigo-700";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>

        <p className="text-sm mb-4 text-gray-500">
          {message || `You are about to spend $${total.toFixed(2)}`}
        </p>

        {message === undefined && (
          <p className="text-2xl font-bold mb-6">${total.toFixed(2)}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg text-white transition ${confirmStyles}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
