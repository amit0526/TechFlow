import { useState } from "react";

function EditForm({ user, setEditingUser, updateUser, fetchUsers, showToast }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || loading) {
      return;
    }

    try {
      setLoading(true);

      await updateUser(user.id, {
        name: name.trim(),
        email: email.trim(),
      });

      await fetchUsers();

      setEditingUser(null);

      showToast("User updated successfully!");
    } catch (error) {
      console.error(error);

      showToast("Failed to update user.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-slate-900 border border-cyan-500/30 p-5 rounded-xl mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Edit User</h2>

          <p className="text-sm text-slate-400 mt-1">Update user information</p>
        </div>

        <button
          type="button"
          onClick={() => setEditingUser(null)}
          disabled={loading}
          className="text-slate-400 hover:text-white text-xl disabled:opacity-40"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        {/* Update */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}

export default EditForm;
