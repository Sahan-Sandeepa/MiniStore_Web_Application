import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import { useState } from "react";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { deactivateUser } from "../api/user";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, logout } = useAuth();
  const loggedIn = !!token;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const deleteAccount = async () => {
    try {
      await deactivateUser();
      setDeleteOpen(false);
      logout();
      toast.success("Account deleted");
      navigate("/login");
    } catch {
      toast.error("Account deletion failed");
    }
  };

  return (
    <>
      <ConfirmOrderModal
        open={deleteOpen}
        total={0}
        title="Delete Account"
        message="Your account will be permanently deactivated. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        onConfirm={deleteAccount}
        onCancel={() => setDeleteOpen(false)}
      />

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate(loggedIn ? "/admin" : "/login")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              MiniStore
            </span>
          </div>

          {loggedIn && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {role === "Admin" && (
                <button onClick={() => navigate("/admin")}>Dashboard</button>
              )}

              <button
                onClick={() => navigate("/products")}
                className={isActive("/products") ? "text-indigo-600" : ""}
              >
                Products
              </button>

              {role === "Customer" && (
                <>
                  <button
                    onClick={() => navigate("/orders")}
                    className={isActive("/orders") ? "text-indigo-600" : ""}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => navigate("/checkout")}
                    className={isActive("/checkout") ? "text-indigo-600" : ""}
                  >
                    Checkout
                  </button>
                </>
              )}

              {role === "Customer" && (
                <button
                  onClick={() => setDeleteOpen(true)}
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
                <button onClick={() => navigate("/login")}>Login</button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Sign up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
