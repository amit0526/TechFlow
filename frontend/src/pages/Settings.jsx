import { useEffect, useState } from "react";

function Settings() {
  const [name, setName] = useState(
    localStorage.getItem("techflow_name") || "Admin",
  );

  const [email, setEmail] = useState(
    localStorage.getItem("techflow_email") || "admin@techflow.com",
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("techflow_darkMode") !== "false",
  );

  const [saved, setSaved] = useState(false);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("techflow_darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("techflow_darkMode", "false");
    }
  }, [darkMode]);

  // Save profile
  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    localStorage.setItem("techflow_name", name.trim());
    localStorage.setItem("techflow_email", email.trim());

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account and application preferences
        </p>
      </div>

      {/* Success */}
      {saved && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-green-400 font-medium">
            ✓ Settings saved successfully!
          </p>
        </div>
      )}

      {/* Profile */}
      <form
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 mb-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Profile</h2>

          <p className="text-sm text-slate-400 mt-1">
            Update your administrator information
          </p>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm text-slate-400 mb-2">Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm text-slate-400 mb-2">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>

      {/* Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Preferences</h2>

          <p className="text-sm text-slate-400 mt-1">
            Customize your application experience
          </p>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Dark Mode</h3>

            <p className="text-sm text-slate-400 mt-1">
              Use the dark interface
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-label="Toggle dark mode"
            className={`relative w-12 h-6 rounded-full transition ${
              darkMode ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                darkMode ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">System</h2>

            <p className="text-sm text-slate-400 mt-1">
              Backend API connection status
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
            Online
          </span>
        </div>
      </div>
    </div>
  );
}

export default Settings;
