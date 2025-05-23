import React from "react";

const UsersList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.id} className="mb-2 border-b pb-1">
        <strong>{user.name}</strong> ({user.email})
      </li>
    ))}
  </ul>
);

export default UsersList;
