import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserForm from "../components/users/UserForm";
import UsersList from "../components/users/UserList";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { addUsertoPartner } from "../api";
import { useUser } from "../context/UserContext";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { userType, token } = useUser();

  if (userType !== "partner") {
    return <Navigate to="/not-found" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const fetchedUsers = await getUsers(token); // implement if needed
        const fetchedUsers = [
          {
            id: 1,
            name: "Jane Cooper",
            email: "jane.cooper@example.com",
            status: "Active",
          },
          {
            id: 2,
            name: "Cody Fisher",
            email: "cody.fisher@example.com",
            status: "Pending",
          },
          {
            id: 3,
            name: "John Doe",
            email: "john.doe@example.com",
            status: "Active",
          },
        ];
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (newUser) => {
    const isDuplicate = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (isDuplicate) {
      alert("User with this email already exists.");
      return;
    }

    try {
      const response = await addUsertoPartner(token, {
        email_id: newUser.email,
      });

      if (response.success) {
        const addedUser = {
          ...newUser,
          id: Date.now(),
          status: "Pending",
        };
        setUsers((prev) => [...prev, addedUser]);
      } else {
        alert(response.error || "Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 h-screen overflow-auto px-6">
        <PastReportHeader />
        <h2 className="text-2xl font-bold text-start text-gray-700 mb-4 mt-20">
          Manage Users
        </h2>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <UserForm onAddUser={handleAddUser} />
        </div>
        <UsersList users={users} />
      </main>
    </div>
  );
};

export default UsersPage;
