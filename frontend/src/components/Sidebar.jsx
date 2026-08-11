import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const linkClass = ({ isActive }) =>
    `block w-full px-4 py-3 rounded-lg font-semibold transition ${
      isActive
        ? "bg-cyan-500 text-slate-950"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static
          top-16 md:top-0
          left-0
          z-50
          w-64
          bg-slate-900
          border-r border-slate-800
          min-h-[calc(100vh-4rem)]
          p-4
          transform transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Mobile Close */}
        <div className="flex justify-end md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
            className={linkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            onClick={() => setSidebarOpen(false)}
            className={linkClass}
          >
            Users
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={linkClass}
          >
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
