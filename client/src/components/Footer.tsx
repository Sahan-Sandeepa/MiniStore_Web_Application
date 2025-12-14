import { isLoggedIn } from "../utils/auth";

export default function Footer() {
  const loggedIn = isLoggedIn();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      {loggedIn ? (
        <p>© {new Date().getFullYear()} MiniStore · Logged in</p>
      ) : (
        <p>
          © {new Date().getFullYear()} MiniStore · Please log in to continue
        </p>
      )}
    </footer>
  );
}
