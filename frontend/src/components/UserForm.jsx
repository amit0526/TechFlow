function UserForm({ name, email, setName, setEmail, addUser }) {
  return (
    <form onSubmit={addUser} className="bg-slate-900 p-6 rounded-xl mb-8">
      <h2 className="text-xl font-semibold mb-4">Add User</h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
        />

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 rounded-lg"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default UserForm;
