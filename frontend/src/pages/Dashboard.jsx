import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Latest 5 users
  const recentUsers = [...users].reverse().slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">Welcome to TechFlow</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/50 bg-red-900/20 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <p className="text-slate-400 text-sm">Total Users</p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            {loading ? "..." : users.length}
          </h2>
        </div>

        {/* Database */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <p className="text-slate-400 text-sm">Database</p>

          <h2 className="text-xl sm:text-2xl font-bold text-green-400 mt-2">
            Connected
          </h2>
        </div>

        {/* API */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <p className="text-slate-400 text-sm">API Status</p>

          <h2 className="text-xl sm:text-2xl font-bold text-green-400 mt-2">
            Online
          </h2>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Recent Users</h2>

          <p className="text-sm text-slate-400 mt-1">
            Latest users added to the system
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-6">
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : recentUsers.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center">
            <p className="text-slate-400">No users found.</p>
          </div>
        ) : (
          /* Users */
          <div>
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-800 last:border-b-0"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {user.name}
                  </h3>

                  <p className="text-sm text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  User
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
