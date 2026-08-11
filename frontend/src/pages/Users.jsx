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
import Toast from "../components/Toast";

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

  // =========================
  // Toast
  // =========================

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);
  };

  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // =========================
  // Fetch Users
  // =========================

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

  // =========================
  // Add User
  // =========================

  const addUser = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setError("");

      await createUser({
        name: name.trim(),
        email: email.trim(),
      });

      setName("");
      setEmail("");

      setCurrentPage(1);

      await fetchUsers();

      showToast("User added successfully!");
    } catch (error) {
      console.error(error);

      setError("Failed to add user. Please try again.");

      showToast("Failed to add user.", "error");
    }
  };

  // =========================
  // Delete User
  // =========================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await deleteUserApi(id);

      await fetchUsers();

      setCurrentPage((page) => Math.max(page - 1, 1));

      showToast("User deleted successfully!");
    } catch (error) {
      console.error(error);

      setError("Failed to delete user. Please try again.");

      showToast("Failed to delete user.", "error");
    }
  };

  // =========================
  // Edit User
  // =========================

  const editUser = (user) => {
    setEditingUser(user);
  };

  // =========================
  // Search
  // =========================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  const totalUsers = users.length;

  const showingFrom = filteredUsers.length === 0 ? 0 : startIndex + 1;

  const showingTo = Math.min(startIndex + usersPerPage, filteredUsers.length);

  // =========================
  // Render
  // =========================

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Toast */}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* =========================
          Header
      ========================= */}

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Users</h1>

        <p className="text-slate-400 mt-2">Manage your users</p>
      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* =========================
          Add User
      ========================= */}

      <UserForm
        name={name}
        email={email}
        setName={setName}
        setEmail={setEmail}
        addUser={addUser}
      />

      {/* =========================
          Edit User
      ========================= */}

      {editingUser && (
        <EditForm
          user={editingUser}
          setEditingUser={setEditingUser}
          updateUser={updateUser}
          fetchUsers={fetchUsers}
          showToast={showToast}
        />
      )}

      {/* =========================
          Stats
      ========================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-slate-400 text-sm">Total Users</p>

            <h2 className="text-3xl font-bold text-cyan-400 mt-1">
              {totalUsers}
            </h2>
          </div>

          <div className="text-sm text-slate-400">
            Showing{" "}
            <span className="text-white font-medium">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="text-white font-medium">
              {filteredUsers.length}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition"
        />
      </div>

      {/* =========================
          Users
      ========================= */}

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <div className="text-4xl mb-3">👤</div>

          <h2 className="text-xl font-semibold text-white">No users found</h2>

          <p className="text-slate-400 mt-2">
            {search
              ? "Try searching with a different name or email."
              : "Add your first user to get started."}
          </p>
        </div>
      ) : (
        <>
          <UserList
            users={paginatedUsers}
            deleteUser={deleteUser}
            editUser={editUser}
          />

          {/* =========================
              Pagination
          ========================= */}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setCurrentPage((page) => Math.max(page - 1, 1));

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                disabled={currentPage === 1}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <span className="px-4 py-2 text-sm text-slate-400">
                Page{" "}
                <span className="text-white font-medium">{currentPage}</span> of{" "}
                <span className="text-white font-medium">{totalPages}</span>
              </span>

              <button
                onClick={() => {
                  setCurrentPage((page) => Math.min(page + 1, totalPages));

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Users;
