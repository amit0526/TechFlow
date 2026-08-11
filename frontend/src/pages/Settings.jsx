function Settings() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">Manage your application settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Name</label>

              <input
                type="text"
                placeholder="Admin"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>

              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg">
              Save Changes
            </button>
          </div>
        </div>

        {/* Application */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Application</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>

              <p className="text-sm text-slate-400">
                Use dark theme across the application
              </p>
            </div>

            <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
          </div>
        </div>

        {/* System */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">System</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Backend Status</p>

              <p className="text-sm text-slate-400">API connection status</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
