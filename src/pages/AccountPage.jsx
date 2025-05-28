import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserForm from "../components/account/UserForm";
import UsersList from "../components/account/UserList";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { addUsertoPartner } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";
import SubscriptionDetails from "../components/account/SubscriptionDetail";
import CreditUsage from "../components/account/CreditUsage";
import {
  UserGroupIcon,
  CreditCardIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const AccountPage = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

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

        <section className="mt-28">
          <h2 className="text-2xl text-start font-semibold text-gray-800 my-8">
            Manage Account
          </h2>

          {/* Tab Navigation */}
          <div className="flex space-x-6 border-b border-gray-200 mb-6">
            {[
              { key: "users", label: "Users", Icon: UserGroupIcon },
              {
                key: "subscription",
                label: "Subscription",
                Icon: WalletIcon,
              },
              {
                key: "creditUsage",
                label: "Credit Usage",
                Icon: CreditCardIcon,
              },
            ].map(({ key, label, Icon }) => (
              <h3
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 pb-2 text-md font-medium cursor-pointer ${
                  activeTab === key
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </h3>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "users" && (
            <>
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <UserForm onAddUser={handleAddUser} />
              </div>
              <UsersList users={users} />
            </>
          )}

          {activeTab === "subscription" && <SubscriptionDetails />}
          {activeTab === "creditUsage" && <CreditUsage />}
        </section>
      </main>
    </div>
  );
};

export default AccountPage;
