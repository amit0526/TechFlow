import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (window.innerWidth < 768 && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="min-w-0 flex-1 bg-slate-950">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-800/70 px-6 py-5">
            <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-xs text-slate-600 sm:flex-row">
              <p>© 2026 TechFlow. All rights reserved.</p>

              <p>Version 1.0.0</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
