function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-slate-300 hover:text-white text-2xl"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-cyan-400">TechFlow 🚀</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
          A
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold">Admin</p>

          <p className="text-xs text-slate-400">Administrator</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
