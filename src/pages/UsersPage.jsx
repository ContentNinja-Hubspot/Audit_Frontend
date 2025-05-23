import React, { useState } from "react";
import UserForm from "../components/users/UserForm";
import UsersList from "../components/users/UserList";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const handleAddUser = (user) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <h1 className="text-2xl font-bold mb-4 mt-20">Add Users</h1>
        <UserForm onAddUser={handleAddUser} />
        <UsersList users={users} />
      </main>
    </div>
  );
};

export default UsersPage;
