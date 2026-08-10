function UserList({ users }) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="bg-slate-800 p-5 rounded-xl">
          <h2 className="text-xl font-semibold">{user.name}</h2>

          <p className="text-slate-400">{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default UserList;
