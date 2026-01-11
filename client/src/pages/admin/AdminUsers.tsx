import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  getAllUsers,
  disableUser,
  enableUser,
  deleteUser,
} from "../../api/adminUsers";
import { AdminUserDto } from "../../types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await getAllUsers());
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDisable = async (id: string) => {
    await disableUser(id);
    toast.success("User disabled");
    loadUsers();
  };

  const handleEnable = async (id: string) => {
    await enableUser(id);
    toast.success("User enabled");
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Permanently delete this user?")) return;
    await deleteUser(id);
    toast.success("User deleted");
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          User Management
        </h1>

        {loading && <p className="text-gray-500">Loading users...</p>}

        {!loading && (
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl shadow">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4">{u.userName}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm
                          ${
                            u.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : u.status === "Disabled"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {u.status === "Active" && (
                        <button
                          onClick={() => handleDisable(u.id)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
                        >
                          Disable
                        </button>
                      )}

                      {u.status === "Disabled" && (
                        <button
                          onClick={() => handleEnable(u.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg"
                        >
                          Enable
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && (
          <div className="md:hidden space-y-4">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow space-y-3"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{u.userName}</span>
                  <span className="text-sm">{u.role}</span>
                </div>

                <span className="text-sm">{u.status}</span>

                <div className="flex gap-2">
                  {u.status === "Active" && (
                    <button
                      onClick={() => handleDisable(u.id)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                    >
                      Disable
                    </button>
                  )}

                  {u.status === "Disabled" && (
                    <button
                      onClick={() => handleEnable(u.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                    >
                      Enable
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(u.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
