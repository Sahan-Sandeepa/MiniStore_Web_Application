import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: Props) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-indigo-100 to-purple-200
                    dark:from-gray-900 dark:to-gray-800 px-4 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900
                   rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {footerText}{" "}
          <a
            href={footerLinkHref}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {footerLinkText}
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
