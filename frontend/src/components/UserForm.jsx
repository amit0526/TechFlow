function UserForm({
  name,
  email,
  setName,
  setEmail,
  addUser,
  loading = false,
}) {
  const isDisabled = loading || !name.trim() || !email.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    await addUser(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
    >
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          User Management
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white">Add New User</h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new user account.
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]">
        {/* Name */}
        <div>
          <label
            htmlFor="user-name"
            className="mb-2 block text-xs font-medium text-slate-400"
          >
            Full Name
          </label>

          <input
            id="user-name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            autoComplete="name"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="user-email"
            className="mb-2 block text-xs font-medium text-slate-400"
          >
            Email Address
          </label>

          <input
            id="user-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            autoComplete="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                Adding...
              </>
            ) : (
              "+ Add User"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default UserForm;
