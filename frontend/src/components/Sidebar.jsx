import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: "▦",
    },
    {
      name: "Users",
      path: "/users",
      icon: "♟",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-slate-950 transition-transform duration-200 md:sticky md:top-16 md:z-30 md:block md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Main Menu
            </p>

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400"
                          : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Info */}
          <div className="border-t border-slate-800 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                  System Online
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                TechFlow admin panel is running normally.
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-600">
              TechFlow v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
