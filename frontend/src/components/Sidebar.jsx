import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen, compactMode = false }) {
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
      {/* =========================
          Mobile Overlay
      ========================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] border-r border-slate-800 bg-slate-950 transition-all duration-200 md:sticky md:top-16 md:z-30 md:block md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          compactMode ? "w-56" : "w-64"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* =========================
              Navigation
          ========================= */}

          <nav
            className={`flex-1 ${
              compactMode ? "space-y-0.5 p-3" : "space-y-1 p-4"
            }`}
          >
            <p
              className={`px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 ${
                compactMode ? "mb-2" : "mb-3"
              }`}
            >
              Main Menu
            </p>

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center rounded-lg text-sm font-medium transition ${
                    compactMode ? "gap-2 px-2.5 py-2" : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex shrink-0 items-center justify-center rounded-lg text-sm ${
                        compactMode ? "h-7 w-7" : "h-8 w-8"
                      } ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400"
                          : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span className="truncate">{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* =========================
              Bottom Info
          ========================= */}

          <div
            className={`border-t border-slate-800 ${
              compactMode ? "p-3" : "p-4"
            }`}
          >
            <div
              className={`rounded-lg border border-slate-800 bg-slate-900 ${
                compactMode ? "p-3" : "p-4"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400">
                  System Online
                </span>
              </div>

              <p
                className={`text-[11px] leading-5 text-slate-500 ${
                  compactMode ? "mt-1.5" : "mt-2"
                }`}
              >
                TechFlow admin panel is running normally.
              </p>
            </div>

            <p
              className={`text-center text-[10px] text-slate-600 ${
                compactMode ? "mt-3" : "mt-4"
              }`}
            >
              TechFlow v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
