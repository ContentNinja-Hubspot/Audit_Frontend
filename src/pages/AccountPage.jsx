import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserForm from "../components/users/UserForm";
import UsersList from "../components/users/UserList";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { addUsertoPartner } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";

const AccountPage = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("manageUsers");

  const { userType, token } = useUser();
  const { success, error } = useNotify();

  if (userType !== "partner") {
    return <Navigate to="/not-found" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
      error("User with this email already exists.");
      return;
    }

    try {
      const response = await addUsertoPartner(token, {
        email_id: newUser.email,
      });

      if (response.success) {
        success("User added successfully.");
        const addedUser = {
          ...newUser,
          id: Date.now(),
          status: "Pending",
        };
        setUsers((prev) => [...prev, addedUser]);
      } else {
        error(response.error || "Failed to add user.");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      error("An error occurred while adding the user.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 h-screen overflow-auto px-6">
        <PastReportHeader />

        {/* Tab Navigation */}
        <div className="flex space-x-6 border-b border-gray-200 mt-28 mb-6">
          {["manageUsers", "subscription", "creditUsage"].map((tab) => (
            <h2
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-md capitalize cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "manageUsers"
                ? "Manage Users"
                : tab === "subscription"
                ? "Subscription"
                : "Credit Usage"}
            </h2>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "manageUsers" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <UserForm onAddUser={handleAddUser} />
            </div>
            <UsersList users={users} />
          </>
        )}

        {activeTab === "subscription" && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
            <p className="text-gray-600">
              Your current subscription plan: <strong>Pro Plan</strong>
            </p>
            <p className="text-gray-600 mt-1">
              Renewal date: <strong>August 20, 2025</strong>
            </p>
          </div>
        )}

        {activeTab === "creditUsage" && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Credit Usage</h3>
            <p className="text-gray-600">
              Available Credits: <strong>0/20</strong>
            </p>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Add Credits
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountPage;
