import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();
  const loggedIn = !!token;

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
      </div>

      <nav className="flex items-center gap-4">
        {!loggedIn ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        ) : (
          <>
            {role === "Admin" && (
              <button onClick={() => navigate("/admin")}>
                Admin Dashboard
              </button>
            )}
            <button onClick={() => navigate("/products")}>Products</button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
