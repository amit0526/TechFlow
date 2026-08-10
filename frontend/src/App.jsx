import { useEffect, useState } from "react";
import { getUsers, createUser } from "./services/userService";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();

    if (!name || !email) return;

    await createUser({ name, email });

    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400">TechFlow 🚀</h1>

        <p className="text-slate-400 mt-2 mb-8">PostgreSQL User Management</p>

        {/* Add User */}
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

        {/* Users */}
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-slate-800 p-5 rounded-xl">
              <h2 className="text-xl font-semibold">{user.name}</h2>

              <p className="text-slate-400">{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
