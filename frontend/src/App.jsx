import { useCallback, useEffect, useState } from "react";

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

import { getCurrentAdmin, getToken, logoutAdmin } from "./services/authService";

import { getSettings } from "./services/settingsService";

// =========================
// Default Settings
// =========================

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  userNotifications: true,
  maintenanceMode: false,
  compactMode: false,
};

// =========================
// App
// =========================

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Authentication
  // =========================

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getToken());
  });

  // =========================
  // Application Settings
  // =========================

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [settingsLoading, setSettingsLoading] = useState(false);

  // =========================
  // Load Settings
  // =========================

  const loadSettings = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setSettings(DEFAULT_SETTINGS);
      setSettingsLoading(false);
      return;
    }

    try {
      setSettingsLoading(true);

      const data = await getSettings();

      const loadedSettings = {
        ...DEFAULT_SETTINGS,
        ...(data || {}),
      };

      setSettings(loadedSettings);
    } catch (error) {
      console.error("Failed to load application settings:", error);

      setSettings(DEFAULT_SETTINGS);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // =========================
  // Load Settings After Login
  // =========================

  useEffect(() => {
    if (!isAuthenticated) {
      setSettings(DEFAULT_SETTINGS);
      setSettingsLoading(false);
      return;
    }

    loadSettings();
  }, [isAuthenticated, loadSettings]);

  // =========================
  // Login
  // =========================

  const handleLogin = async () => {
    const token = getToken();

    if (!token) {
      console.error("Login completed but JWT token is missing.");

      setIsAuthenticated(false);

      return;
    }

    setIsAuthenticated(true);

    await loadSettings();
  };

  // =========================
  // Settings Updated
  // =========================

  const handleSettingsChange = useCallback((updatedSettings) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...DEFAULT_SETTINGS,
      ...(updatedSettings || {}),
    }));
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    logoutAdmin();

    setIsAuthenticated(false);
    setSettings(DEFAULT_SETTINGS);
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
                settings={settings}
                settingsLoading={settingsLoading}
                onSettingsChange={handleSettingsChange}
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

// =========================
// Admin Panel
// =========================

function AdminPanel({
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  settings,
  settingsLoading,
  onSettingsChange,
}) {
  const location = useLocation();

  const admin = getCurrentAdmin();

  // =========================
  // Current Page
  // =========================

  const isSettingsPage = location.pathname === "/settings";

  // =========================
  // Maintenance Mode
  // =========================

  if (!settingsLoading && settings.maintenanceMode && !isSettingsPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-amber-400/30 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10 text-2xl">
            🔧
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-amber-400">
            Maintenance Mode
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            TechFlow is temporarily unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            The application has been placed into maintenance mode by an
            administrator. Please try again later.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/settings"
              className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Open Settings
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Normal Application
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
        admin={admin}
      />

      <div className="flex">
        {/* Sidebar */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          compactMode={settings.compactMode}
        />

        {/* Main */}

        <main
          className={`min-w-0 flex-1 transition-all ${
            settings.compactMode ? "p-3 sm:p-4 md:p-5" : "p-4 sm:p-6 md:p-8"
          }`}
        >
          {/* Settings Loading */}

          {settingsLoading && (
            <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-500">
              Loading application settings...
            </div>
          )}

          {/* Routes */}

          <Routes>
            {/* Dashboard */}

            <Route path="/" element={<Dashboard />} />

            {/* Users */}

            <Route
              path="/users"
              element={
                <Users
                  userNotifications={
                    settingsLoading ? false : settings.userNotifications
                  }
                />
              }
            />

            {/* Settings */}

            <Route
              path="/settings"
              element={<Settings onSettingsChange={onSettingsChange} />}
            />

            {/* Profile */}

            <Route path="/profile" element={<Profile />} />

            {/* Change Password */}

            <Route path="/change-password" element={<ChangePassword />} />

            {/* 404 */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// =========================
// 404
// =========================

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
