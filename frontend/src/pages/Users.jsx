import { useCallback, useEffect, useMemo, useState } from "react";

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

const USERS_PER_PAGE = 5;

function Users({ userNotifications = true }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // =========================
  // Toast
  // =========================

  const showToast = useCallback((message, type = "success") => {
    setToast({
      message,
      type,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast({
      message: "",
      type: "success",
    });
  }, []);

  // =========================
  // Fetch Users
  // =========================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch users error:", error);

      // Errors should always be visible.
      showToast(
        error.message || "Failed to load users. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // =========================
  // Add User
  // =========================

  const addUser = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      showToast("Name and email are required.", "error");
      return;
    }

    try {
      setSaving(true);

      await createUser({
        name: trimmedName,
        email: trimmedEmail,
      });

      setName("");
      setEmail("");
      setCurrentPage(1);

      await fetchUsers();

      // User Notifications ON → show success notification
      if (userNotifications) {
        showToast("User added successfully.");
      }
    } catch (error) {
      console.error("Add user error:", error);

      showToast(
        error.message || "Failed to add user. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Delete User
  // =========================

  const deleteUser = async (id) => {
    if (!id) {
      showToast("Invalid user ID.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await deleteUserApi(id);

      await fetchUsers();

      // User Notifications ON → show success notification
      if (userNotifications) {
        showToast("User deleted successfully.");
      }
    } catch (error) {
      console.error("Delete user error:", error);

      showToast(
        error.message || "Failed to delete user. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Edit User
  // =========================

  const editUser = (user) => {
    if (!user) return;

    setEditingUser(user);
  };

  // =========================
  // Search + Filter
  // =========================

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    let result = users.filter((user) => {
      if (!searchText) {
        return true;
      }

      const userName = user.name?.toLowerCase() || "";
      const userEmail = user.email?.toLowerCase() || "";

      return userName.includes(searchText) || userEmail.includes(searchText);
    });

    switch (filter) {
      case "name-asc":
        result = [...result].sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );
        break;

      case "name-desc":
        result = [...result].sort((a, b) =>
          (b.name || "").localeCompare(a.name || ""),
        );
        break;

      case "email-asc":
        result = [...result].sort((a, b) =>
          (a.email || "").localeCompare(b.email || ""),
        );
        break;

      case "email-desc":
        result = [...result].sort((a, b) =>
          (b.email || "").localeCompare(a.email || ""),
        );
        break;

      default:
        break;
    }

    return result;
  }, [users, search, filter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  const totalUsers = users.length;

  const showingFrom = filteredUsers.length === 0 ? 0 : startIndex + 1;

  const showingTo = Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length);

  // =========================
  // Pagination
  // =========================

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Users
        </h1>

        <p className="mt-2 text-slate-400">
          Manage users, accounts and access.
        </p>
      </div>

      {/* Add User */}

      <UserForm
        name={name}
        email={email}
        setName={setName}
        setEmail={setEmail}
        addUser={addUser}
        loading={saving}
      />

      {/* Edit User */}

      {editingUser && (
        <EditForm
          user={editingUser}
          setEditingUser={setEditingUser}
          updateUser={updateUser}
          fetchUsers={fetchUsers}
          onSuccess={() => {
            if (userNotifications) {
              showToast("User updated successfully.");
            }
          }}
          onError={(error) => {
            showToast(
              error?.message || "Failed to update user. Please try again.",
              "error",
            );
          }}
        />
      )}

      {/* Stats */}

      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Users</p>

            <h2 className="mt-1 text-3xl font-bold text-cyan-400">
              {totalUsers}
            </h2>
          </div>

          <div className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-medium text-white">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white">
              {filteredUsers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search + Filter */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
        <div>
          <label
            htmlFor="user-search"
            className="mb-2 block text-xs font-medium text-slate-400"
          >
            Search Users
          </label>

          <input
            id="user-search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

        <div>
          <label
            htmlFor="user-filter"
            className="mb-2 block text-xs font-medium text-slate-400"
          >
            Filter
          </label>

          <select
            id="user-filter"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          >
            <option value="all">All Users</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="email-asc">Email A → Z</option>
            <option value="email-desc">Email Z → A</option>
          </select>
        </div>
      </div>

      {/* User List */}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mb-3 text-4xl">{search ? "🔎" : "👤"}</div>

          <h2 className="text-lg font-semibold text-white">
            {search ? "No users found" : "No users yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
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

          {/* Pagination */}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 1 || saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                ← Previous
              </button>

              <span className="rounded-lg px-4 py-2 text-sm text-slate-400">
                Page{" "}
                <span className="font-medium text-white">{currentPage}</span> of{" "}
                <span className="font-medium text-white">{totalPages}</span>
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
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
