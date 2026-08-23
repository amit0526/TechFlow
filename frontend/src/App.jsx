import { useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

import { getCurrentAdmin, getToken, logoutAdmin } from "./services/authService";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Authentication
  // =========================

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getToken());
  });

  // =========================
  // Login
  // =========================

  const handleLogin = () => {
    const token = getToken();

    if (!token) {
      console.error("Login completed but JWT token is missing.");
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    logoutAdmin();

    setIsAuthenticated(false);
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            Login
        ========================= */}

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* =========================
            Protected Application
        ========================= */}

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AdminPanel
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================
   Admin Panel
========================= */

function AdminPanel({ sidebarOpen, setSidebarOpen, onLogout }) {
  const admin = getCurrentAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
        admin={admin}
      />

      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/users" element={<Users />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/change-password" element={<ChangePassword />} />

            {/* =========================
                404
            ========================= */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* =========================
   404
========================= */

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-cyan-400">404</p>

        <h1 className="mt-4 text-2xl font-bold text-white">Page Not Found</h1>

        <p className="mt-2 text-sm text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default App;
