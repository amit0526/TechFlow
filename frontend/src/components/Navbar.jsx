function Navbar({ setSidebarOpen }) {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-slate-300 hover:text-white text-2xl"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-cyan-400">TechFlow 🚀</h1>
      </div>

      <div className="text-sm text-slate-400">Admin</div>
    </nav>
  );
}

export default Navbar;
