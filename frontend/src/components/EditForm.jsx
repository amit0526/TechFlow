import { useEffect, useState } from "react";

function EditForm({
  user,
  setEditingUser,
  updateUser,
  fetchUsers,
  onSuccess,
  onError,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Load Selected User
  // =========================

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  // =========================
  // Update User
  // =========================

  const handleUpdate = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      onError?.(new Error("Name and email are required."));
      return;
    }

    if (!user?.id) {
      onError?.(new Error("Invalid user selected."));
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await updateUser(user.id, {
        name: trimmedName,
        email: trimmedEmail,
      });

      // Refresh users after successful update
      await fetchUsers();

      // Close edit form
      setEditingUser(null);

      onSuccess?.();
    } catch (error) {
      console.error("Update user error:", error);

      onError?.(
        error instanceof Error ? error : new Error("Failed to update user."),
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Close
  // =========================

  const handleClose = () => {
    if (loading) return;

    setEditingUser(null);
  };

  if (!user) {
    return null;
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="mb-6 rounded-xl border border-cyan-500/30 bg-slate-900 p-5 shadow-lg"
    >
      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Management
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">Edit User</h2>

          <p className="mt-1 text-sm text-slate-500">
            Update user account information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          aria-label="Close edit form"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          ×
        </button>
      </div>

      {/* Fields */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Name */}

        <div>
          <label
            htmlFor="edit-user-name"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Name
          </label>

          <input
            id="edit-user-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            placeholder="Enter user name"
            autoComplete="name"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Email */}

        <div>
          <label
            htmlFor="edit-user-email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Email
          </label>

          <input
            id="edit-user-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            placeholder="Enter email address"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Actions */}

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </div>
    </form>
  );
}

export default EditForm;
