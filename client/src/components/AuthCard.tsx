import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const AuthCard = ({ title, subtitle, children }: Props) => {
  return (
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
    </motion.div>
  );
};

export default AuthCard;
