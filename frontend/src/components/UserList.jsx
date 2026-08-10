function UserList({ users , deleteUser }) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="bg-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>

          <p className="text-slate-400">{user.email}</p>
          </div>

          <button
            onClick={() => deleteUser(user.id)}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg"> Delete
          </button>
          </div>
      ))}
    </div>
  );
}

export default UserList;
