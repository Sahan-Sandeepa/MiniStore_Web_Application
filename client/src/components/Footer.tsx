import { ArrowUpIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../auth/AuthContext";
import { FooterColumn, FooterLink } from "../utils/footer";

export default function Footer() {
  const { token, role } = useAuth();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            MiniStore
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            A modern e-commerce platform built for learning, scale, and
            real-world experience.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.66-1.86 3.42-1.86 3.66 0 4.33 2.41 4.33 5.55v6.2zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
              </svg>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75-2.35 7-7 7-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>

            <a
              href="https://skype.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
              aria-label="Skype"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M21.06 9.03c.06-.33.09-.66.09-1.03a4.5 4.5 0 00-9-1.5H11a7 7 0 00-7 7c0 .37.03.7.09 1.03a4.5 4.5 0 109 1.5h1.06a7 7 0 007-7c0-.37-.03-.7-.09-1.03z" />
              </svg>
            </a>

            <a href="#" className="hover:text-emerald-600 transition">
              <GlobeAltIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <FooterColumn title="Product">
          <FooterLink to="/products">Products</FooterLink>
          <FooterLink to="/orders">Orders</FooterLink>
          <FooterLink to="/checkout">Checkout</FooterLink>
        </FooterColumn>

        <FooterColumn title="Company">
          <FooterLink to={"/maintenance"}>About</FooterLink>
          <FooterLink to={"/maintenance"}>Careers</FooterLink>
        </FooterColumn>

        <FooterColumn title="Support">
          <FooterLink to={"/maintenance"}>Help Center</FooterLink>
          <FooterLink to={"/maintenance"}>Contact Support</FooterLink>
          <FooterLink to={"/maintenance"}>System Status</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} MiniStore • v1.0.0 • </span>

          <div className="flex items-center gap-3">
            {role === "Admin" && (
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                Admin
              </span>
            )}

            <span>{token ? "Signed in" : "Guest mode"}</span>

            <button
              onClick={scrollToTop}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
