import { useState } from "react";

function EditForm({
  user,
  setEditingUser,
  updateUser,
  fetchUsers,
  loading,
  setLoading,
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !email || loading) return;

    try {
      setLoading(true);

      await updateUser(user.id, {
        name,
        email,
      });

      await fetchUsers();

      setEditingUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-slate-900 border border-cyan-500/30 p-5 rounded-xl mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit User</h2>

        <button
          type="button"
          onClick={() => setEditingUser(null)}
          disabled={loading}
          className="text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
}

export default EditForm;
