function UserList({ users, deleteUser, editUser }) {
  if (!Array.isArray(users) || users.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
      {/* Desktop Header */}

      <div className="hidden border-b border-slate-800 px-5 py-4 md:grid md:grid-cols-[1.5fr_1.5fr_120px_150px] md:items-center md:gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          User
        </p>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email
        </p>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Status
        </p>

        <p className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
          Actions
        </p>
      </div>

      {/* Users */}

      <div className="divide-y divide-slate-800">
        {users.map((user) => {
          const userName = user?.name?.trim() || "Unnamed User";
          const userEmail = user?.email || "No email";
          const userId = user?.id;

          const initials =
            userName === "Unnamed User"
              ? "U"
              : userName
                  .split(/\s+/)
                  .map((word) => word.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

          return (
            <div
              key={userId}
              className="px-5 py-4 transition hover:bg-slate-800/40"
            >
              {/* =========================
                  Desktop
              ========================= */}

              <div className="hidden md:grid md:grid-cols-[1.5fr_1.5fr_120px_150px] md:items-center md:gap-4">
                {/* User */}

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-400"
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {userName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-600">
                      ID: {userId}
                    </p>
                  </div>
                </div>

                {/* Email */}

                <p
                  className="truncate text-sm text-slate-400"
                  title={userEmail}
                >
                  {userEmail}
                </p>

                {/* Status */}

                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />
                    Active
                  </span>
                </div>

                {/* Actions */}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => editUser(user)}
                    aria-label={`Edit ${userName}`}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteUser(userId)}
                    aria-label={`Delete ${userName}`}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* =========================
                  Mobile
              ========================= */}

              <div className="md:hidden">
                <div className="flex items-start gap-3">
                  {/* Avatar */}

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-400"
                    aria-hidden="true"
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      {/* User Info */}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {userName}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {userEmail}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-600">
                          ID: {userId}
                        </p>
                      </div>

                      {/* Status */}

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                          aria-hidden="true"
                        />
                        Active
                      </span>
                    </div>

                    {/* Actions */}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => editUser(user)}
                        className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteUser(userId)}
                        className="flex-1 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
