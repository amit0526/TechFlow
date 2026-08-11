import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  deleteUser as deleteUserApi,
  updateUser,
} from "../services/userService";

import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import EditForm from "../components/EditForm";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load users. Please try again.");
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

    try {
      setError("");

      await createUser({ name, email });

      setName("");
      setEmail("");
      setCurrentPage(1);

      await fetchUsers();
    } catch (error) {
      console.error(error);
      setError("Failed to add user. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await deleteUserApi(id);

      await fetchUsers();
    } catch (error) {
      console.error(error);
      setError("Failed to delete user. Please try again.");
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  const totalUsers = users.length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Users</h1>

      <p className="text-slate-400 mt-2 mb-8">Manage your users</p>

      {/* Add User */}
      <UserForm
        name={name}
        email={email}
        setName={setName}
        setEmail={setEmail}
        addUser={addUser}
      />

      {/* Edit User */}
      {editingUser && (
        <EditForm
          user={editingUser}
          setEditingUser={setEditingUser}
          updateUser={updateUser}
          fetchUsers={fetchUsers}
        />
      )}

      {/* Total Users */}
      <div className="bg-slate-900 p-5 rounded-xl mb-6">
        <p className="text-slate-400">Total Users</p>

        <h2 className="text-3xl font-bold text-cyan-400">{totalUsers}</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
        />
      </div>

      {/* Users */}
      {loading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 p-5 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          <UserList
            users={paginatedUsers}
            deleteUser={deleteUser}
            editUser={editUser}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-slate-400">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Users;
