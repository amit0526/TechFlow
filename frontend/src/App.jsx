import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser as deleteUserApi,  updateUser, } from "./services/userService";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import EditForm from "./components/EditForm";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

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

     const deleteUser = async (id) => {
      await deleteUserApi(id);
       fetchUsers();
     };
    
      const editUser = (user) => {
      console.log("Editing user:", user);
       setEditingUser(user);
       };

  
  

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
          <EditForm user={editingUser}
          />
        )}

        {/* Users */}
        <UserList
          users={users}
          deleteUser={deleteUser}
          editUser={editUser}
        />
      </div>
    </div>
  );
}

export default App;
