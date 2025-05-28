import React, { useState } from "react";

const statusClasses = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

const UsersList = ({ users }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User List</h3>
        <input
          type="text"
          className="border border-gray-300 px-3 py-1 rounded"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-2 font-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className={`px-2 py-1 text-sm rounded-full font-medium ${
                    statusClasses[user.status] || "bg-gray-200 text-gray-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
