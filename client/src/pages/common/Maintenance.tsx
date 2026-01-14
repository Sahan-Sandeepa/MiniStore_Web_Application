import { useNavigate } from "react-router-dom";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900">
            <WrenchScrewdriverIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Under Development
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          This section is currently being worked on and will be available soon.
          Thank you for your patience while we improve MiniStore.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white
                       hover:bg-indigo-700 transition"
          >
            Go to Home
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          MiniStore • Feature coming soon
        </p>
      </div>
    </div>
  );
}
