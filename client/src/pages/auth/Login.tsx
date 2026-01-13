import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthLayout from "../../components/AuthLayout";
import { login } from "../../api/auth";
import { getRoleFromToken } from "../../utils/jwt";
import { useAuth } from "../../auth/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const isFormValid = userName.trim().length > 2 && password.length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    try {
      const res = await login({ userName, password });
      auth.login(res.token);
      toast.success("Login successful 🎉");

      const role = getRoleFromToken(res.token);
      navigate(role === "Admin" ? "/admin" : "/home");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout
        title="Welcome Back 👋"
        subtitle="Sign in to your MiniStore account"
        footerText="Don't have an account?"
        footerLinkText="Register"
        footerLinkHref="/register"
      >
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         text-gray-800 dark:text-white
                         px-4 py-2.5 focus:ring-2 focus:ring-indigo-500
                         transition placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800
                           text-gray-800 dark:text-white
                           px-4 py-2.5 pr-12 focus:ring-2 focus:ring-indigo-500
                           transition placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full flex items-center justify-center gap-3
                       bg-indigo-600 text-white font-semibold py-2.5
                       rounded-lg hover:bg-indigo-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
