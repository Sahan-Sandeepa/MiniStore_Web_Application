import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, logout } = useAuth();
  const loggedIn = !!token;

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(loggedIn ? "/products" : "/login")}
        >
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            MiniStore
          </span>
        </div>

        {loggedIn && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => navigate("/products")}
              className={`hover:text-indigo-500 ${
                isActive("/products") && "text-indigo-600"
              }`}
            >
              Products
            </button>

            {role === "Customer" && (
              <>
                <button
                  onClick={() => navigate("/orders")}
                  className={`hover:text-indigo-500 ${
                    isActive("/orders") && "text-indigo-600"
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className={`hover:text-indigo-500 ${
                    isActive("/checkout") && "text-indigo-600"
                  }`}
                >
                  Checkout
                </button>
              </>
            )}

            {role === "Admin" && (
              <button
                onClick={() => navigate("/admin")}
                className={`hover:text-indigo-500 ${
                  isActive("/admin") && "text-indigo-600"
                }`}
              >
                Admin Dashboard
              </button>
            )}

            {role === "Customer" && (
              <button
                onClick={async () => {
                  // eslint-disable-next-line no-restricted-globals
                  if (!confirm("This action cannot be undone. Continue?"))
                    return;

                  await fetch("/api/users/me/deactivate", {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  logout();
                  toast.success("Account deleted");
                  navigate("/login");
                }}
                className="text-red-600 hover:underline"
              >
                Delete My Account
              </button>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <DarkModeToggle />

          {!loggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium hover:text-indigo-500"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Sign up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
