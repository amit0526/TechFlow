import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser as deleteUserApi,  updateUser, } from "./services/userService";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import EditForm from "./components/EditForm";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
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

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    
    if (!confirmDelete) return;

      await deleteUserApi(id);
       fetchUsers();
     };
    
      const editUser = (user) => {
      console.log("Editing user:", user);
       setEditingUser(user);
       };
     
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );
     const totalUsers = users.length;
  

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400">TechFlow 🚀</h1>

        <p className="text-slate-400 mt-2 mb-8">PostgreSQL User Management</p>

        {/* Add User */}
        <UserForm
          name={name}
          email={email}
          setName={setName}
          setEmail={setEmail}
          addUser={addUser}
        />
        {editingUser && (
          <EditForm
            user={editingUser}
            setEditingUser={setEditingUser}
            updateUser={updateUser}
            fetchUsers={fetchUsers}
          />
        )}

        <div className="bg-slate-900 p-5 rounded-xl mb-6">
          <p className="text-slate-400">Total Users</p>
          <h2 className="text-3xl font-bold text-cyan-400">{totalUsers}</h2>
        </div>

        {/* {Search} */}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Users */}

        {loading ? (
          <p className="text-slate-400">Loading users...</p>
        ) : (
          <UserList
            users={filteredUsers}
            deleteUser={deleteUser}
            editUser={editUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;
