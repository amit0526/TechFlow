function UserForm({ name, email, setName, setEmail, addUser, loading }) {
  return (
    <form
      onSubmit={addUser}
      className="bg-slate-900 border border-slate-800 p-5 rounded-xl mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">Add User</h2>

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
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
