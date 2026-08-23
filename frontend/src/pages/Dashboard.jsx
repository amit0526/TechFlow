import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUsers } from "../services/userService";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Authentication Status
  // =========================

  const isAuthenticated = localStorage.getItem("techflowAuth") === "true";

  // =========================
  // Load Dashboard Data
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(error.message || "Failed to load dashboard data.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalUsers = users.length;

  const recentUsers = [...users].slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* =========================
          Header
      ========================= */}

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back. Here's what's happening with TechFlow.
        </p>
      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
        >
          <p className="text-sm font-medium text-red-300">{error}</p>
        </div>
      )}

      {/* =========================
          Stats
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={loading ? "—" : totalUsers}
          icon="👥"
          description="Registered users"
        />

        <StatCard
          title="User Records"
          value={loading ? "—" : totalUsers}
          icon="✓"
          description="Available in database"
          success
        />

        <StatCard
          title="API Status"
          value={loading ? "Checking..." : error ? "Offline" : "Online"}
          icon="⚡"
          description="Backend connection"
          success={!error}
        />

        <StatCard
          title="Database"
          value="PostgreSQL"
          icon="◆"
          description="Database engine"
        />
      </div>

      {/* =========================
          Main Grid
      ========================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =========================
            Recent Users
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="font-semibold text-white">Recent Users</h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest users added to the system
              </p>
            </div>

            <Link
              to="/users"
              className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

              <p className="text-sm text-slate-500">Loading users...</p>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-3 text-3xl">👤</div>

              <p className="text-sm text-slate-400">No users available yet.</p>

              <Link
                to="/users"
                className="mt-4 inline-flex rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Add User
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentUsers.map((user) => {
                const initials =
                  user.name
                    ?.trim()
                    .split(/\s+/)
                    .map((word) => word.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U";

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-4 transition hover:bg-slate-800/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {user.name || "Unnamed User"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {user.email || "No email"}
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 sm:inline-flex">
                      Registered
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================
            System Status
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="font-semibold text-white">System Status</h2>

            <p className="mt-1 text-xs text-slate-500">
              Current application health
            </p>
          </div>

          <div className="space-y-4 p-5">
            <StatusRow
              label="API Server"
              status={error ? "Unavailable" : "Operational"}
              success={!error}
            />

            <StatusRow
              label="PostgreSQL"
              status={error ? "Check Connection" : "Connected"}
              success={!error}
            />

            <StatusRow
              label="User Service"
              status={error ? "Unavailable" : "Operational"}
              success={!error}
            />

            {/* Authentication */}

            <StatusRow
              label="Authentication"
              status={isAuthenticated ? "Operational" : "Not Configured"}
              success={isAuthenticated}
            />
          </div>
        </section>
      </div>

      {/* =========================
          Quick Actions
      ========================= */}

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-white">Quick Actions</h2>

          <p className="mt-1 text-xs text-slate-500">
            Frequently used admin actions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            to="/users"
            icon="+"
            title="Add User"
            description="Create a new user"
          />

          <QuickAction
            to="/users"
            icon="👥"
            title="Manage Users"
            description="View and edit users"
          />

          <QuickAction
            to="/settings"
            icon="⚙"
            title="Settings"
            description="Configure application"
          />
        </div>
      </section>
    </div>
  );
}

/* =========================
   Stat Card
========================= */

function StatCard({ title, value, icon, description, success = false }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h2
            className={`mt-2 text-2xl font-bold ${
              success ? "text-emerald-400" : "text-cyan-400"
            }`}
          >
            {value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

/* =========================
   Status Row
========================= */

function StatusRow({ label, status, success }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            success ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />

        <span className="text-sm text-slate-300">{label}</span>
      </div>

      <span
        className={`text-xs ${success ? "text-emerald-400" : "text-amber-400"}`}
      >
        {status}
      </span>
    </div>
  );
}

/* =========================
   Quick Action
========================= */

function QuickAction({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400/30 hover:bg-slate-800/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-sm text-cyan-400 transition group-hover:bg-cyan-400/20">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-white">{title}</p>

          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default Dashboard;
