import { Menu, X } from "lucide-react";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1 className="text-xl font-bold text-cyan-400">TechFlow 🚀</h1>
      </div>

      {/* Admin */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
          A
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-white">Admin</p>
          <p className="text-xs text-slate-400">Administrator</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
