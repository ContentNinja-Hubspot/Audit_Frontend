import React, { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { fetchUsersOfPartner } from "../../api";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";

const statusClasses = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

const UsersList = ({ users, setUsers }) => {
  const [search, setSearch] = useState("");
  const { token } = useUser();
  const { themeId } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchUsersOfPartner(token);
        const fetchedUsers = response.users || [];
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || u.email_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">User List</h3>
        <input
          type="text"
          className="w-full sm:w-64 border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full  table-auto text-left text-sm min-w-[500px]">
          <thead>
            <tr className="text-gray-500 border-b text-center bg-gray-200">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Resend</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.user_id || user.id}
                className="border-b hover:bg-gray-50 text-center"
              >
                <td className="py-2 font-medium">{user.name || "N/A"}</td>
                <td>{user.email || user.email_id || "N/A"}</td>
                <td className="capitalize">{user.role || "N/A"}</td>
                <td>
                  <span
                    className={`px-2 py-1 text-sm rounded-full font-medium ${
                      user.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.status === "Accepted"
                        ? `bg-partner-secondary-${themeId}`
                        : ` text-gray-800`
                    }`}
                  >
                    {user.status || "N/A"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      console.log(
                        `Resend invite to ${
                          user.email || user.email_id || "unknown"
                        }`
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded bg-inherit"
                    title="Resend invite"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 text-gray-600 hover:text-indigo-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
