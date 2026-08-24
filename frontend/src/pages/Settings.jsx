import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../services/settingsService";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  userNotifications: true,
  maintenanceMode: false,
  compactMode: false,
};

function Settings({ onSettingsChange }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // Load Settings From Backend
  // =========================

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoaded(false);
        setError("");
        setMessage("");

        const data = await getSettings();

        if (!mounted) return;

        const loadedSettings = {
          ...DEFAULT_SETTINGS,
          ...data,
        };

        setSettings(loadedSettings);
        setSavedSettings(loadedSettings);

        // Sync with App.jsx
        onSettingsChange?.(loadedSettings);
      } catch (error) {
        if (!mounted) return;

        console.error("Failed to load settings:", error);

        setError(error.message || "Failed to load settings from the server.");
      } finally {
        if (mounted) {
          setLoaded(true);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [onSettingsChange]);

  // =========================
  // Check Unsaved Changes
  // =========================

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // =========================
  // Update Setting
  // =========================

  const updateSetting = (key) => {
    setSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setMessage("");
    setError("");
  };

  // =========================
  // Save Settings
  // =========================

  const saveSettings = async () => {
    if (!hasChanges || saving) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await updateSettings(settings);

      const updatedSettings = {
        ...DEFAULT_SETTINGS,
        ...(response?.settings || settings),
      };

      setSettings(updatedSettings);
      setSavedSettings(updatedSettings);

      // IMPORTANT:
      // Update App.jsx immediately
      onSettingsChange?.(updatedSettings);

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error("Failed to save settings:", error);

      setError(error.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Reset Unsaved Changes
  // =========================

  const resetChanges = () => {
    setSettings(savedSettings);

    setMessage("");
    setError("");
  };

  // =========================
  // Restore Defaults
  // =========================

  const restoreDefaults = async () => {
    const confirmed = window.confirm(
      "Restore all settings to their default values?",
    );

    if (!confirmed || saving) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await updateSettings(DEFAULT_SETTINGS);

      const restoredSettings = {
        ...DEFAULT_SETTINGS,
        ...(response?.settings || {}),
      };

      setSettings(restoredSettings);
      setSavedSettings(restoredSettings);

      // IMPORTANT:
      // Update App.jsx immediately
      onSettingsChange?.(restoredSettings);

      setMessage("Default settings restored.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error("Failed to restore defaults:", error);

      setError(error.message || "Failed to restore default settings.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (!loaded) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* =========================
          Header
      ========================= */}

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Configuration
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your TechFlow admin panel preferences.
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
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* =========================
            Notifications
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Notifications</h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose which notifications you want to receive.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            <SettingRow
              title="Email Notifications"
              description="Receive important system notifications by email."
              enabled={settings.emailNotifications}
              onChange={() => updateSetting("emailNotifications")}
              disabled={saving}
            />

            <SettingRow
              title="User Notifications"
              description="Get notified when users are created or updated."
              enabled={settings.userNotifications}
              onChange={() => updateSetting("userNotifications")}
              disabled={saving}
            />
          </div>
        </section>

        {/* =========================
            Application
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Application</h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure how the admin panel behaves.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            <SettingRow
              title="Maintenance Mode"
              description="Put the application into maintenance mode."
              enabled={settings.maintenanceMode}
              onChange={() => updateSetting("maintenanceMode")}
              warning
              disabled={saving}
            />

            <SettingRow
              title="Compact Mode"
              description="Use a more compact layout for the dashboard."
              enabled={settings.compactMode}
              onChange={() => updateSetting("compactMode")}
              disabled={saving}
            />
          </div>
        </section>

        {/* =========================
            Database & API
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">Database & API</h2>

            <p className="mt-1 text-sm text-slate-500">
              Current TechFlow system information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard label="Database" value="PostgreSQL" />

            <InfoCard label="Environment" value="Development" />

            <InfoCard label="API" value="Online" success />

            <InfoCard label="Server" value="Port 5000" success />
          </div>
        </section>

        {/* =========================
            Current Configuration
        ========================= */}

        <section className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white">
              Current Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quick overview of your current preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <ConfigCard
              label="Email Notifications"
              enabled={settings.emailNotifications}
            />

            <ConfigCard
              label="User Notifications"
              enabled={settings.userNotifications}
            />

            <ConfigCard
              label="Maintenance Mode"
              enabled={settings.maintenanceMode}
              warning
            />

            <ConfigCard label="Compact Mode" enabled={settings.compactMode} />
          </div>
        </section>

        {/* =========================
            Save Actions
        ========================= */}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {message ? (
                <p className="text-sm font-medium text-emerald-400">
                  {message}
                </p>
              ) : hasChanges ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />

                  <p className="text-sm text-amber-400">
                    You have unsaved changes.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <p className="text-sm text-slate-500">
                    All settings are saved.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetChanges}
                disabled={!hasChanges || saving}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Discard Changes
              </button>

              <button
                type="button"
                onClick={restoreDefaults}
                disabled={saving}
                className="rounded-lg border border-amber-400/30 px-5 py-2.5 text-sm font-medium text-amber-400 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Saving..." : "Restore Defaults"}
              </button>

              <button
                type="button"
                onClick={saveSettings}
                disabled={!hasChanges || saving}
                className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Setting Row
========================= */

function SettingRow({
  title,
  description,
  enabled,
  onChange,
  warning = false,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title} ${enabled ? "enabled" : "disabled"}`}
        onClick={onChange}
        disabled={disabled}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50 ${
          enabled
            ? warning
              ? "border-amber-400 bg-amber-400"
              : "border-cyan-400 bg-cyan-400"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================
   Info Card
========================= */

function InfoCard({ label, value, success = false }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <div className="mt-2 flex items-center gap-2">
        {success && <span className="h-2 w-2 rounded-full bg-emerald-400" />}

        <p
          className={`text-sm font-medium ${
            success ? "text-emerald-400" : "text-white"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================
   Configuration Card
========================= */

function ConfigCard({ label, enabled, warning = false }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            enabled
              ? warning
                ? "bg-amber-400"
                : "bg-emerald-400"
              : "bg-slate-600"
          }`}
        />

        <p
          className={`text-sm font-medium ${
            enabled
              ? warning
                ? "text-amber-400"
                : "text-emerald-400"
              : "text-slate-500"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>
    </div>
  );
}

export default Settings;
