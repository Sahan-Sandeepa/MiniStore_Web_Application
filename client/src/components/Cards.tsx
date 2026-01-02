export const DashboardCard = ({
  title,
  value,
  loading,
}: {
  title: string;
  value: number | string;
  loading: boolean;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{loading ? "—" : value}</p>
    </div>
  );
};

export const ActionCard = ({
  title,
  description,
  onClick,
  color,
}: {
  title: string;
  description: string;
  onClick: () => void;
  color: "indigo" | "green" | "purple";
}) => {
  const colors = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{description}</p>
      </div>
      <button
        onClick={onClick}
        className={`mt-6 text-white px-4 py-2 rounded-lg transition ${colors[color]}`}
      >
        Go
      </button>
    </div>
  );
};
