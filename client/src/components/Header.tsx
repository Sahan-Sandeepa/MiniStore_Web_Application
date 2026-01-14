import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  UserCircleIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../auth/AuthContext";
import ConfirmOrderModal from "./ConfirmOrderModal";
import DarkModeToggle from "./DarkModeToggle";
import { deactivateUser } from "../api/user";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, logout } = useAuth();

  const loggedIn = !!token;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "text-indigo-600 dark:text-indigo-400"
      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600";

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
            onClick={() => navigate(loggedIn ? "/admin" : "/")}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              MiniStore
            </span>
          </div>

          {loggedIn && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {role === "Admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className={isActive("/admin")}
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={() => navigate("/products")}
                className={isActive("/products")}
              >
                Products
              </button>

              {role === "Customer" && (
                <>
                  <button
                    onClick={() => navigate("/orders")}
                    className={isActive("/orders")}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => navigate("/checkout")}
                    className={isActive("/checkout")}
                  >
                    Checkout
                  </button>
                </>
              )}

              <button
                onClick={() => navigate("/maintenance")}
                className={isActive("/maintenance")}
              >
                Help
              </button>
            </nav>
          )}

          <div className="flex items-center gap-4">
            <DarkModeToggle />

            {loggedIn && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600"
                >
                  <UserCircleIcon className="w-8 h-8" />
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 overflow-hidden">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/maintenance");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LifebuoyIcon className="w-4 h-4" />
                      Help Center
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>

                    {role === "Customer" && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setDeleteOpen(true);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete Account
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
