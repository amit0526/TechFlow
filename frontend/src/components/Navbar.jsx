import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={sidebarOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
          >
            <span className="text-xl" aria-hidden="true">
              {sidebarOpen ? "×" : "☰"}
            </span>
          </button>

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-2"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400"
              aria-hidden="true"
            >
              🚀
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                TechFlow
              </p>

              <p className="hidden text-[10px] text-slate-500 sm:block">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-2">
          {/* System Status */}
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 sm:flex">
            <span
              className="h-2 w-2 rounded-full bg-emerald-400"
              aria-hidden="true"
            />

            <span className="text-xs text-slate-400">System Online</span>
          </div>

          {/* Profile */}
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Open admin profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-950">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium text-white">Admin</p>

              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>

            <span
              className={`hidden text-xs text-slate-500 transition sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              {/* Backdrop */}
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                <div className="border-b border-slate-800 p-4">
                  <p className="text-sm font-medium text-white">Admin</p>

                  <p className="mt-1 text-xs text-slate-500">
                    admin@techflow.local
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    ⚙ Settings
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    👤 Profile
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
