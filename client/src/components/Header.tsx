import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import { toast } from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-bold cursor-pointer text-indigo-600 dark:text-indigo-400"
          onClick={() => navigate(loggedIn ? "/products" : "/login")}
        >
          MiniStore
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ◀
        </button>

        <button
          onClick={() => navigate(1)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ▶
        </button>
      </div>

      <nav className="flex items-center gap-4">
        {!loggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/products")}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
            >
              Products
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
