function UserList({ users, deleteUser, editUser }) {
  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="bg-slate-900 p-8 rounded-xl text-center">
          <h2 className="text-xl font-semibold">No users found</h2>

          <p className="text-slate-400 mt-2">
            Try adding a new user or changing your search.
          </p>
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="bg-slate-800 p-5 rounded-xl flex  flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>

              <p className="text-slate-400">{user.email}</p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => editUser(user)}
                className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="flex-1 sm:flex-none bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;
