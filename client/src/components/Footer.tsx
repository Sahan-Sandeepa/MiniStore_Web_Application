import { useAuth } from "../auth/AuthContext";

export default function Footer() {
  const { token, role } = useAuth();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            MiniStore
          </span>
        </span>

        <div className="flex gap-4">
          {role === "Admin" && <span>Admin</span>}
        </div>

        <span className="text-xs">{token ? "Signed in" : "Guest mode"}</span>
      </div>
    </footer>
  );
}
