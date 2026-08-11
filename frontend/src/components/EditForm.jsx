import { useState } from "react";

function EditForm({ user, setEditingUser, updateUser,fetchUsers, }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateUser(user.id, {
      name,
      email,
    });
     
    await fetchUsers();

    setEditingUser(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl mb-8">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className=" w-full sm:flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" w-full sm:flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
        />

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 rounded-lg w-full sm:w-auto"
        >
          Update
        </button>

        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="bg-slate-600 hover:bg-slate-500 px-6 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditForm;
