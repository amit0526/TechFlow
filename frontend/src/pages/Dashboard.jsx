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

  const totalUsers = users.length;

  const recentUsers = [...users].reverse().slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">Welcome to TechFlow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400">Total Users</p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            {loading ? "..." : totalUsers}
          </h2>
        </div>

        {/* Database */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400">Database</p>

          <h2 className="text-xl font-bold text-green-400 mt-2">Connected</h2>
        </div>

        {/* API */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <p className="text-slate-400">API Status</p>

          <h2 className="text-xl font-bold text-green-400 mt-2">Online</h2>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Recent Users</h2>

          <p className="text-sm text-slate-400 mt-1">
            Latest users added to the system
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="text-red-400">{error}</p>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-800/50 transition"
              >
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>

                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 w-fit">
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
