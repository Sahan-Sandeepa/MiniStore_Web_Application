import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  getAllUsers,
  disableUser,
  enableUser,
  deleteUser,
} from "../../api/adminUsers";
import { AdminUserDto } from "../../types/user";
import ConfirmOrderModal from "../../components/ConfirmOrderModal";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<AdminUserDto | null>(null);
  const [action, setAction] = useState<"disable" | "enable" | "delete" | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [search, statusFilter, users]);

  const openModal = (
    user: AdminUserDto,
    actionType: "disable" | "enable" | "delete"
  ) => {
    setTargetUser(user);
    setAction(actionType);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetUser || !action) return;

    try {
      if (action === "disable") {
        await disableUser(targetUser.id);
        toast.success("User disabled");
      }

      if (action === "enable") {
        await enableUser(targetUser.id);
        toast.success("User enabled");
      }

      if (action === "delete") {
        await deleteUser(targetUser.id);
        toast.success("User deleted");
      }

      loadUsers();
    } catch {
      toast.error("Action failed");
    } finally {
      setModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-sm font-semibold">
            Active
          </span>
        );
      case "Disabled":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 text-sm font-semibold">
            Disabled
          </span>
        );
      case "Deleted":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 text-sm font-semibold">
            Deleted
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors duration-300">
      <Toaster position="top-right" />

      <ConfirmOrderModal
        open={modalOpen}
        total={0}
        title={
          action === "delete"
            ? "Delete User"
            : action === "disable"
            ? "Disable User"
            : "Enable User"
        }
        message={
          action === "delete"
            ? "This user will be permanently removed. This action cannot be undone."
            : action === "disable"
            ? "This user will be disabled and unable to log in."
            : "This user will be re-enabled."
        }
        confirmText={
          action === "delete"
            ? "Delete"
            : action === "disable"
            ? "Disable"
            : "Enable"
        }
        variant={action === "delete" ? "danger" : "default"}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          User Management
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
          <input
            type="text"
            placeholder="Search by username..."
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                      {u.userName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {u.role}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      {u.status === "Active" && (
                        <button
                          onClick={() => openModal(u, "disable")}
                          className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition-colors text-sm"
                        >
                          Disable
                        </button>
                      )}

                      {u.status === "Disabled" && (
                        <button
                          onClick={() => openModal(u, "enable")}
                          className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors text-sm"
                        >
                          Enable
                        </button>
                      )}

                      {u.status !== "Deleted" && (
                        <button
                          onClick={() => openModal(u, "delete")}
                          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors text-sm"
                        >
                          Delete
                        </button>
                      )}

                      {u.status === "Deleted" && (
                        <span className="text-gray-400 dark:text-gray-300 text-sm italic">
                          Deleted (read-only)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                No users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
