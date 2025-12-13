import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="absolute top-4 right-4 text-sm px-3 py-1.5
                 rounded-lg bg-gray-200 dark:bg-gray-700
                 text-gray-800 dark:text-gray-200
                 hover:opacity-80 transition"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
};

export default DarkModeToggle;
